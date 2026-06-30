import { Thread, LiveRoom, LiveParticipant, LiveMessage, Category } from "./types";

export interface ProgramItem {
  id: string;
  category: Category;
  title: string;
  sub: string;
  desc: string;
  image: string;
  rating: number;
  tags: string[];
}

export const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: "m1",
    category: "Manga",
    title: "Chainsaw Man",
    sub: "By Tatsuki Fujimoto",
    desc: "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. However, this is a far cry from reality, as Denji is forced by the yakuza to kill devils in order to pay off his crushing debts.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    tags: ["Action", "Dark Fantasy", "Gore"]
  },
  {
    id: "m2",
    category: "Manga",
    title: "Monster",
    sub: "By Naoki Urasawa",
    desc: "Kenzou Tenma, a brilliant neurosurgeon with a bright future, risks everything to save the life of a young boy. Years later, Tenma discovers the boy has grown into a charismatic charismatic psychopath.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    tags: ["Psychological", "Mystery", "Thriller"]
  },
  {
    id: "mw1",
    category: "Manhwa",
    title: "Solo Leveling",
    sub: "By Chugong & DUBU",
    desc: "In a world where hunters must battle deadly monsters to protect mankind, Sung Jinwoo, the weakest hunter of all mankind, finds himself in a struggle for survival deep within an extremely rare Double Dungeon.",
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    tags: ["Action", "Fantasy", "System"]
  },
  {
    id: "mw2",
    category: "Manhwa",
    title: "Tower of God",
    sub: "By SIU",
    desc: "What is your greatest desire? Money, glory, power, revenge, or something that surpasses all others? Whatever you seek, it is waiting at the very peak of the Tower.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    tags: ["Adventure", "Fantasy", "Mystery"]
  },
  {
    id: "a1",
    category: "Anime",
    title: "Demon Slayer (Kimetsu no Yaiba)",
    sub: "Ufotable Studio",
    desc: "Tanjiro Kamado's family is slaughtered by demons, and his sister Nezuko is turned into one. He joins the Demon Slayer Corps to find a way to turn her back to human.",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    tags: ["Action", "Historical", "Supernatural"]
  },
  {
    id: "a2",
    category: "Anime",
    title: "Frieren: Beyond Journey's End",
    sub: "Madhouse Studio",
    desc: "Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren must live on long after her mortal companions grow old.",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.95,
    tags: ["Adventure", "Drama", "Fantasy"]
  }
];

export const INITIAL_THREADS: Thread[] = [
  {
    id: "t1",
    category: "Anime",
    title: "Is Frieren the best slice of life fantasy ever created?",
    content: "Seriously! The pacing, the quiet moments of quiet joy, and the passage of time are rendered so beautifully. Most fantasy shows run so fast to battle arcs, but Frieren's search for simple spell scrolls is magic in itself. What do you guys think?",
    author: "AnimeFanatic88",
    avatarUrl: "🌸",
    likes: 42,
    date: "2026-06-15",
    replies: [
      {
        id: "r1",
        author: "MangaManiac_JP",
        avatarUrl: "🔥",
        content: "Totally agree! It turns the standard 'hero's party ends the quest' formula on its head. The melancholy is deeply satisfying.",
        date: "2026-06-15"
      },
      {
        id: "r2",
        author: "OtakuKnight",
        avatarUrl: "⚔️",
        content: "The battle animation by Madhouse is also phenomenal. When they do show action, it looks elite.",
        date: "2026-06-16"
      }
    ]
  },
  {
    id: "t2",
    category: "Manga",
    title: "The Genius of Naoki Urasawa's Monster Masterpiece",
    content: "Johan Liebert is genuinely one of the most terrifying villains in any medium because of how psychological his influence is. He never uses superpowers, just pure charisma and exploitation of the dark side of the human soul. Unbeatable storytelling.",
    author: "MangaManiac_JP",
    avatarUrl: "🔥",
    likes: 38,
    date: "2026-06-14",
    replies: [
      {
        id: "r3",
        author: "OtakuKnight",
        avatarUrl: "⚔️",
        content: "The Munich library arc and Dr. Tenma's psychological struggle is just legendary stuff. Best manga ever printed.",
        date: "2026-06-15"
      }
    ]
  },
  {
    id: "t3",
    category: "Manhwa",
    title: "Solo Leveling anime adaptation vs original webtoon review",
    content: "Just finished comparing both. The anime stays extremely faithful to Chugong's pacing while expanding side characters' pre-raid roles. The epic red-and-blue glowing art by DUBU is hard to replicate, but A-1 Pictures did a solid job with the music production by Sawano!",
    author: "OtakuKnight",
    avatarUrl: "⚔️",
    likes: 29,
    date: "2026-06-12",
    replies: []
  }
];

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  votesOptionA: number;
  votesOptionB: number;
  votesOptionC: number;
  optionA: string;
  optionB: string;
  optionC: string;
}

export const DAILY_DEBATE_TOPIC: DebateTopic = {
  id: "daily_1",
  title: "Is Eren Yeager's Rumbling morally justified to save Paradis, or is he an unforgivable monster?",
  description: "Attack on Titan's ultimate ethical dilemma. Speak with other fans on stage or cast your vote below to influence the sanctuary's consensus!",
  votesOptionA: 452,
  votesOptionB: 512,
  votesOptionC: 120,
  optionA: "Morally Justified",
  optionB: "Unforgivable Monster",
  optionC: "It's Complicated / Grey"
};

export const INITIAL_LIVE_ROOMS: LiveRoom[] = [
  {
    id: "sub-vs-sub",
    title: "Sub vs Dub: The Ultimate Debate 🗣️",
    topic: "Is watching anime in original Japanese voice acting with subtitles superior to English/localized dubs?",
    host: "SubElitist",
    hostAvatar: "🍣",
    listenersCount: 142,
    tags: ["Anime", "Debate", "Meta"],
    type: "Debate",
    participants: [
      { name: "SubElitist", avatar: "🍣", role: "host", stance: "Sub Only" },
      { name: "DubEnjoyer", avatar: "🍔", role: "speaker", stance: "Dub Only", isSpeaking: true },
      { name: "MangaPurist", avatar: "📚", role: "speaker", stance: "Read Manga First" },
      { name: "CasualViewer", avatar: "🍿", role: "listener" },
      { name: "AniemLover", avatar: "🌸", role: "listener" }
    ],
    messages: [
      {
        id: "m_1_1",
        author: "SubElitist",
        avatar: "🍣",
        content: "Welcome back everyone to today's ultimate showdown. We are discussing Sub vs Dub. DubEnjoyer, you have the stage. Tell us why you think Dubs are better!",
        timestamp: "08:31 AM",
        isVoice: true
      },
      {
        id: "m_1_2",
        author: "DubEnjoyer",
        avatar: "🍔",
        content: "Thanks! For me, it's about pure immersion. I don't want to spend 20 minutes reading the bottom of the screen. I want to look at the masterclass animation by ufotable, not the fonts!",
        timestamp: "08:32 AM",
        isVoice: true
      },
      {
        id: "m_1_3",
        author: "MangaPurist",
        avatar: "📚",
        content: "Wait, but original voice actors work directly with the directors. You lose 50% of the emotional delivery and nuance in localization!",
        timestamp: "08:33 AM",
        isVoice: true
      }
    ]
  },
  {
    id: "goku-vs-saitama",
    title: "Saitama vs Goku Power scaling debate 🥊",
    topic: "Could Saitama's gag-character scaling break through Goku's Mastered Ultra Instinct in a death match?",
    host: "GokuStan99",
    hostAvatar: "⚡",
    listenersCount: 289,
    tags: ["Anime", "Powerscaling", "Fun"],
    type: "Debate",
    participants: [
      { name: "GokuStan99", avatar: "⚡", role: "host", stance: "Goku Solos" },
      { name: "OnePunchFan", avatar: "✊", role: "speaker", stance: "Saitama One-Shots", isSpeaking: true },
      { name: "WeebScientist", avatar: "🔬", role: "speaker", stance: "Physics Debate" },
      { name: "LuffyGear5", avatar: "🍖", role: "listener" }
    ],
    messages: [
      {
        id: "m_2_1",
        author: "GokuStan99",
        avatar: "⚡",
        content: "Alright y'all, welcome. Let's establish facts. Goku has multiversal speed and tier-1 combat intelligence. Saitama's best feat is star-level. Goku literally speed-blitzes.",
        timestamp: "08:29 AM",
        isVoice: true
      },
      {
        id: "m_2_2",
        author: "OnePunchFan",
        avatar: "✊",
        content: "Bro, you don't get Saitama's entire concept. His power is a literal gag; he is written to end battles in one punch regardless of the opponent. Goku's training doesn't beat narrative plot armor!",
        timestamp: "08:30 AM",
        isVoice: true
      }
    ]
  },
  {
    id: "chainsawman-theories",
    title: "Chainsaw Man: What is Fujimoto Cooking? 🩸",
    topic: "Analyzing the latest psychological twists and predicting who will survive the next major arc.",
    host: "MakimaSimp",
    hostAvatar: "🐕",
    listenersCount: 94,
    tags: ["Manga", "Theory", "Casual"],
    type: "Casual",
    participants: [
      { name: "MakimaSimp", avatar: "🐕", role: "host" },
      { name: "FujimotoAcolyte", avatar: "🩸", role: "speaker", isSpeaking: true },
      { name: "DenjiProtectionSquad", avatar: "🍎", role: "speaker" },
      { name: "NayutaDefender", avatar: "🍨", role: "listener" }
    ],
    messages: [
      {
        id: "m_3_1",
        author: "MakimaSimp",
        avatar: "🐕",
        content: "I literally cannot sleep after the latest chapters. Fujimoto is a mad genius, but my heart is in pieces.",
        timestamp: "08:34 AM",
        isVoice: true
      },
      {
        id: "m_3_2",
        author: "FujimotoAcolyte",
        avatar: "🩸",
        content: "I swear, Fujimoto doesn't write manga; he writes cinematic jazz. Every chapter is completely unpredictable. I think Denji is going to lose everything again.",
        timestamp: "08:35 AM",
        isVoice: true
      }
    ]
  }
];



