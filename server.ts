import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI functionality will use fallback responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Generate a simulated debate/conversation response from an opponent/participant
app.post("/api/debate/respond", async (req, res) => {
  try {
    const { topic, title, messages, userMessage, responderName, responderStance, type } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build the debate transcript so Gemini understands context
    const transcript = (messages || [])
      .slice(-6)
      .map((m: any) => `${m.author} (${m.stance || 'No stance'}): "${m.content}"`)
      .join("\n");

    const sysInst = `You are simulating an active participant in a live voice discussion room or stage channel called "${title}".
The topic of discussion is: "${topic}".
The type of session is: "${type || 'Debate'}".

You are playing the role of "${responderName}" ${responderStance ? `with the stance: "${responderStance}"` : ''}.
Keep your tone highly conversational, like a real person talking on a Discord Stage or a Clubhouse voice channel.
- Be casual, spontaneous, and slightly opinionated, but stay respectful (PG-13).
- You can agree, disagree, ask questions, or bring up a specific anime example.
- Keep your response short and punchy (1-2 sentences maximum), as if spoken on a voice call.
- Do NOT use formal letters, greeting clichés ("Greetings fellow otaku"), or robotic syntax.
- Do NOT wrap your text in quotation marks or speaker labels. Just output the spoken words.`;

    const prompt = `Here is the current discussion transcript:
${transcript}

${userMessage ? `The user just said: "${userMessage}"` : ""}

Now, it is your turn to speak as ${responderName} ${responderStance ? `(Stance: ${responderStance})` : ''}. Formulate your short response reacting naturally to the conversation:`;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "MOCK_KEY") {
      // Fallback response when developer hasn't configured API key yet
      const fallbacks: Record<string, string[]> = {
        "SubElitist": [
          "Bro, there is just no way. Original voice acting has so much more range! Watch the sub first!",
          "Localization is fine, but you lose the original director's intent. Subs are the only pure way.",
        ],
        "DubEnjoyer": [
          "Honestly, I just want to sit back and watch the fight scenes. High-quality dubs are elite now!",
          "Dubs have gotten so good recently. Look at Cyberpunk or Frieren's English voice cast!"
        ],
        "OnePunchFan": [
          "Saitama is a gag character! His power is infinite by definition, Goku can't scale past that.",
          "Goku has limiters, Saitama literally broke his limiters. That's the whole point of the series!"
        ],
        "GokuStan99": [
          "Goku has Ultra Instinct. He literally can't be touched by physical punches anymore.",
          "Goku has fought gods of destruction. Saitama hasn't faced anyone near that scale!"
        ]
      };

      const fallbackList = fallbacks[responderName] || [
        "That's an interesting point, but we have to look at the manga context too!",
        "I'm not sure about that, what do you guys think?",
        "Fujimoto is definitely cooking something absolutely insane in the latest chapters!"
      ];
      const randomReply = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      return res.json({ response: randomReply });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInst,
        temperature: 0.85,
      },
    });

    res.json({ response: response?.text || "" });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate debate response.",
      details: error.message || error,
    });
  }
});

// Setup Vite middleware for development, and static assets in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ANIEM] Server started running on http://localhost:${PORT}`);
  });
}

setupServer();
