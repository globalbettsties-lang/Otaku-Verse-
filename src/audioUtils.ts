// Web Audio retro synthesizer for arcade-style chimes and vocal pitch generation
export function playRetroBeep(type: "click" | "success" | "laser" | "voice" = "click", pitchModifier = 1.0) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "click") {
      // Short click beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(600 * pitchModifier, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "success") {
      // Tri-tone positive arpeggio
      osc.type = "triangle";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(400 * pitchModifier, now);
      osc.frequency.setValueAtTime(600 * pitchModifier, now + 0.08);
      osc.frequency.setValueAtTime(800 * pitchModifier, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    } else if (type === "laser") {
      // Classic sweep down
      osc.type = "sawtooth";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1200 * pitchModifier, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start();
      osc.stop(now + 0.25);
    } else if (type === "voice") {
      // Quick gentle blip for text typewriter sound
      osc.type = "sine";
      osc.frequency.setValueAtTime((300 + Math.random() * 200) * pitchModifier, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Web Audio blocked or unsupported
    console.warn("Web Audio playback failed:", e);
  }
}

// Browser TTS generator with custom parameters for pitch/speed and language fallbacks
export function speakText(text: string, pitch = 1.0, rate = 1.0, stopFallback = false) {
  if (!("speechSynthesis" in window)) {
    return;
  }
  
  try {
    window.speechSynthesis.cancel(); // Stop playing current voices
    if (stopFallback && !text) return;

    // Clean up text of anime actions like *blushes* to make voice smooth
    const voiceText = text.replace(/\*[^*]+\*/g, "").trim();
    if (!voiceText) return;

    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 0.9;
    
    // Choose voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer English/Japanese depending on text content
    const containsJapanese = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/g.test(text);
    
    let targetVoice = null;
    if (containsJapanese) {
      targetVoice = voices.find(v => v.lang.startsWith("ja"));
    }
    if (!targetVoice) {
      targetVoice = voices.find(v => v.lang.startsWith("en") && (pitch > 1.2 ? v.name.includes("Zira") || v.name.includes("Google US English") : true));
    }
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("Speech Synthesis error:", e);
  }
}
