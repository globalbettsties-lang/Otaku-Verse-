export type Category = "Manga" | "Manhwa" | "Anime";

export interface Reply {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
}

export interface Thread {
  id: string;
  category: Category;
  title: string;
  content: string;
  author: string;
  avatarUrl: string;
  likes: number;
  replies: Reply[];
  date: string;
  rating?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface LiveParticipant {
  name: string;
  avatar: string;
  role: "host" | "speaker" | "listener";
  isSpeaking?: boolean;
  stance?: string;
}

export interface LiveMessage {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface LiveRoom {
  id: string;
  title: string;
  topic: string;
  host: string;
  hostAvatar: string;
  listenersCount: number;
  tags: string[];
  type: "Debate" | "Casual";
  participants: LiveParticipant[];
  messages: LiveMessage[];
}

