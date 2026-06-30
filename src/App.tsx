import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  User, 
  Users,
  Plus, 
  CornerDownRight, 
  Trash, 
  Headphones,
  CheckCircle,
  Hash,
  Compass,
  Code,
  Sliders,
  Play
} from "lucide-react";
import { Thread, Reply, ContactMessage, LiveRoom, LiveParticipant, LiveMessage } from "./types";
import { INITIAL_PROGRAMS, INITIAL_THREADS, DAILY_DEBATE_TOPIC, INITIAL_LIVE_ROOMS, ProgramItem } from "./data";
import { playRetroBeep } from "./audioUtils";

export default function App() {
  // --- STATE ---
  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    const saved = localStorage.getItem("aniem_programs");
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [threads, setThreads] = useState<Thread[]>(() => {
    const saved = localStorage.getItem("aniem_threads");
    return saved ? JSON.parse(saved) : INITIAL_THREADS;
  });

  const [contactInbox, setContactInbox] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem("aniem_inbox");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeExploreTab, setActiveExploreTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  // Forum States
  const [showAddThread, setShowAddThread] = useState(false);
  const [newThreadCategory, setNewThreadCategory] = useState<"Manga" | "Manhwa" | "Anime">("Anime");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadAuthor, setNewThreadAuthor] = useState("");
  const [newThreadAvatar, setNewThreadAvatar] = useState("🌸");
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [newReplyText, setNewReplyText] = useState("");
  const [avatarMenu, setAvatarMenu] = useState(false);

  // Live Sessions & Debates States
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>(() => {
    const saved = localStorage.getItem("aniem_live_rooms");
    return saved ? JSON.parse(saved) : INITIAL_LIVE_ROOMS;
  });
  const [dailyTopic, setDailyTopic] = useState(() => {
    const saved = localStorage.getItem("aniem_daily_topic");
    return saved ? JSON.parse(saved) : DAILY_DEBATE_TOPIC;
  });
  const [userDailyVote, setUserDailyVote] = useState<string | null>(() => {
    return localStorage.getItem("aniem_user_daily_vote") || null;
  });
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isRoomSpeaker, setIsRoomSpeaker] = useState(false);
  const [userStance, setUserStance] = useState("");
  const [roomChatInput, setRoomChatInput] = useState("");
  const [isSimulatedDebaterResponding, setIsSimulatedDebaterResponding] = useState(false);
  const [spawnedReactions, setSpawnedReactions] = useState<{ id: string; emoji: string; style: any }[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // New room form states
  const [createRoomTitle, setCreateRoomTitle] = useState("");
  const [createRoomTopic, setCreateRoomTopic] = useState("");
  const [createRoomTags, setCreateRoomTags] = useState("");
  const [createRoomType, setCreateRoomType] = useState<"Debate" | "Casual">("Debate");
  const [createRoomStance, setCreateRoomStance] = useState("");

  // Contact States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isMessageSubmitted, setIsMessageSubmitted] = useState(false);

  // UI States
  const [activePage, setActivePage] = useState<"home" | "about" | "explore" | "forums" | "companion" | "contact">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(30);
  const [interactiveVisualizer, setInteractiveVisualizer] = useState<number[]>([15, 40, 25, 75, 45, 90, 60, 30, 70, 40, 55, 30, 80, 20]);

  // Reference for chat end
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("aniem_programs", JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("aniem_threads", JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem("aniem_inbox", JSON.stringify(contactInbox));
  }, [contactInbox]);

  useEffect(() => {
    localStorage.setItem("aniem_live_rooms", JSON.stringify(liveRooms));
  }, [liveRooms]);

  useEffect(() => {
    localStorage.setItem("aniem_daily_topic", JSON.stringify(dailyTopic));
  }, [dailyTopic]);

  useEffect(() => {
    if (userDailyVote) {
      localStorage.setItem("aniem_user_daily_vote", userDailyVote);
    }
  }, [userDailyVote]);

  // Keep chat scrolled down
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveRooms, activeRoomId, isSimulatedDebaterResponding]);

  // Simulated visualizer jumping
  useEffect(() => {
    const interval = setInterval(() => {
      setInteractiveVisualizer(prev => 
        prev.map(() => Math.floor(Math.random() * 85) + 15)
      );
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Show a visual notification toast
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // --- HANDLERS ---

  // Program / Database rating update
  const handleRateProgram = (programId: string, rating: number) => {
    playRetroBeep("click");
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        // Average-in user's rating
        const newRating = parseFloat(((p.rating * 9 + rating) / 10).toFixed(2));
        triggerNotification(`Thank you! Submitted rating: ${rating}⭐ for ${p.title}`);
        return { ...p, rating: newRating };
      }
      return p;
    }));
  };

  // Vote for Daily Debate Topic
  const handleVoteDailyTopic = (option: "A" | "B" | "C") => {
    if (userDailyVote) return; // Can only vote once
    playRetroBeep("success");
    setUserDailyVote(option);
    setDailyTopic(prev => {
      const updated = { ...prev };
      if (option === "A") updated.votesOptionA += 1;
      else if (option === "B") updated.votesOptionB += 1;
      else updated.votesOptionC += 1;
      triggerNotification("Your official stance vote has been recorded! 🗳️");
      return updated;
    });
  };

  // Launch a new custom debate or casual conversation room
  const handleCreateLiveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createRoomTitle.trim() || !createRoomTopic.trim()) {
      return alert("Otaku, please fill out the title and topic first!");
    }
    playRetroBeep("success");

    const tagsArray = createRoomTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newRoom: LiveRoom = {
      id: "room_" + Date.now(),
      title: createRoomTitle.trim(),
      topic: createRoomTopic.trim(),
      host: "You (Host)",
      hostAvatar: "👑",
      listenersCount: Math.floor(Math.random() * 15) + 5,
      tags: tagsArray.length > 0 ? tagsArray : ["Anime", "Chitchat"],
      type: createRoomType,
      participants: [
        { name: "You (Host)", avatar: "👑", role: "host", stance: createRoomStance.trim() || "Pro-Topic" },
        { name: "OtakuSage", avatar: "🥋", role: "speaker", stance: "Neutral Analyst" },
        { name: "MeguminStarlight", avatar: "💥", role: "listener" },
        { name: "LuffyKing", avatar: "🍖", role: "listener" }
      ],
      messages: [
        {
          id: "msg_init",
          author: "System Bot",
          avatar: "🤖",
          content: `Welcome to "${createRoomTitle.trim()}". Voice stream initialized. Type a point or request to speak!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setLiveRooms(prev => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setIsRoomSpeaker(true); // You are the host, so you are a speaker
    setUserStance(createRoomStance.trim() || "Pro-Topic");
    
    // Reset fields
    setCreateRoomTitle("");
    setCreateRoomTopic("");
    setCreateRoomTags("");
    setCreateRoomStance("");
    setCreateRoomType("Debate");
    setShowCreateRoomModal(false);
    triggerNotification(`Successfully launched room: "${newRoom.title}"!`);
  };

  // Spawn visual reaction emoji burst
  const handleSpawnReaction = (emoji: string) => {
    playRetroBeep("click", 1.2);
    const id = "react_" + Date.now() + "_" + Math.random();
    const style = {
      left: `${Math.floor(Math.random() * 60) + 20}%`,
      bottom: "80px",
      transform: `rotate(${Math.floor(Math.random() * 40) - 20}deg)`,
    };
    
    setSpawnedReactions(prev => [...prev, { id, emoji, style }]);
    
    // Automatically remove after 2.5s (animation duration)
    setTimeout(() => {
      setSpawnedReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  // Send a message/point in the active live room and get simulated responses
  const handleSendDebateMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roomChatInput.trim() || !activeRoomId) return;

    const text = roomChatInput.trim();
    setRoomChatInput("");
    playRetroBeep("click");

    const currentRoom = liveRooms.find(r => r.id === activeRoomId);
    if (!currentRoom) return;

    const newMessage: LiveMessage = {
      id: "m_user_" + Date.now(),
      author: "You",
      avatar: isRoomSpeaker ? "👑" : "🍿",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: isRoomSpeaker
    };

    const updatedMessages = [...currentRoom.messages, newMessage];
    
    setLiveRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        return {
          ...r,
          messages: updatedMessages
        };
      }
      return r;
    }));

    // Find other speakers to respond
    const availableResponders = currentRoom.participants.filter(
      p => p.name !== "You" && p.name !== "You (Host)" && p.role !== "listener"
    );

    if (availableResponders.length === 0) return;
    const responder = availableResponders[Math.floor(Math.random() * availableResponders.length)];

    setIsSimulatedDebaterResponding(true);

    try {
      const response = await fetch("/api/debate/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentRoom.topic,
          title: currentRoom.title,
          type: currentRoom.type,
          messages: updatedMessages,
          userMessage: text,
          responderName: responder.name,
          responderStance: responder.stance
        })
      });

      const data = await response.json();
      setIsSimulatedDebaterResponding(false);

      if (data.response) {
        const responseMessage: LiveMessage = {
          id: "m_sim_" + Date.now(),
          author: responder.name,
          avatar: responder.avatar,
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoice: true
        };

        setLiveRooms(prev => prev.map(r => {
          if (r.id === activeRoomId) {
            const updatedParticipants = r.participants.map(p => {
              if (p.name === responder.name) {
                return { ...p, isSpeaking: true };
              }
              return { ...p, isSpeaking: false };
            });
            return {
              ...r,
              participants: updatedParticipants,
              messages: [...r.messages, responseMessage]
            };
          }
          return r;
        }));

        setTimeout(() => {
          setLiveRooms(prev => prev.map(r => {
            if (r.id === activeRoomId) {
              const updatedParticipants = r.participants.map(p => {
                if (p.name === responder.name) {
                  return { ...p, isSpeaking: false };
                }
                return p;
              });
              return {
                ...r,
                participants: updatedParticipants
              };
            }
            return r;
          }));
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setIsSimulatedDebaterResponding(false);
    }
  };

  // Prompt the next debate argument from a participant without user typing
  const handlePromptNextArgument = async () => {
    if (!activeRoomId) return;
    const currentRoom = liveRooms.find(r => r.id === activeRoomId);
    if (!currentRoom) return;

    const availableResponders = currentRoom.participants.filter(
      p => p.name !== "You" && p.name !== "You (Host)" && p.role !== "listener"
    );

    if (availableResponders.length === 0) return;
    const responder = availableResponders[Math.floor(Math.random() * availableResponders.length)];

    setIsSimulatedDebaterResponding(true);
    playRetroBeep("click");

    try {
      const response = await fetch("/api/debate/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentRoom.topic,
          title: currentRoom.title,
          type: currentRoom.type,
          messages: currentRoom.messages,
          userMessage: null,
          responderName: responder.name,
          responderStance: responder.stance
        })
      });

      const data = await response.json();
      setIsSimulatedDebaterResponding(false);

      if (data.response) {
        const responseMessage: LiveMessage = {
          id: "m_sim_" + Date.now(),
          author: responder.name,
          avatar: responder.avatar,
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoice: true
        };

        setLiveRooms(prev => prev.map(r => {
          if (r.id === activeRoomId) {
            const updatedParticipants = r.participants.map(p => {
              if (p.name === responder.name) {
                return { ...p, isSpeaking: true };
              }
              return { ...p, isSpeaking: false };
            });
            return {
              ...r,
              participants: updatedParticipants,
              messages: [...r.messages, responseMessage]
            };
          }
          return r;
        }));

        setTimeout(() => {
          setLiveRooms(prev => prev.map(r => {
            if (r.id === activeRoomId) {
              const updatedParticipants = r.participants.map(p => {
                if (p.name === responder.name) {
                  return { ...p, isSpeaking: false };
                }
                return p;
              });
              return {
                ...r,
                participants: updatedParticipants
              };
            }
            return r;
          }));
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setIsSimulatedDebaterResponding(false);
    }
  };

  // Create new Forum Thread
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !newThreadAuthor.trim()) {
      return alert("Otaku, please fill out all fields first!");
    }

    playRetroBeep("success");

    const newThread: Thread = {
      id: "thread_" + Date.now(),
      category: newThreadCategory,
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
      author: newThreadAuthor.trim(),
      avatarUrl: newThreadAvatar,
      likes: 1,
      replies: [],
      date: new Date().toISOString().split("T")[0]
    };

    setThreads(prev => [newThread, ...prev]);
    setShowAddThread(false);
    
    // Reset inputs
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadAuthor("");
    
    triggerNotification(`New discussion thread about "${newThread.title}" was published!`);
  };

  // Add Reply Comment
  const handleAddReply = (threadId: string) => {
    if (!newReplyText.trim()) return;

    playRetroBeep("click");
    const replyAuthor = "You (" + (newThreadAuthor || "Guest Otaku") + ")";
    const newReply: Reply = {
      id: "reply_" + Date.now(),
      author: replyAuthor,
      avatarUrl: "🦊",
      content: newReplyText.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    }));

    setNewReplyText("");
    triggerNotification("Discussion comment posted!");
  };

  // Upvote thread
  const handleLikeThread = (threadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    playRetroBeep("click", 1.3);
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    }));
  };

  // Handle Contact Form Submit with instant logs updates
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    playRetroBeep("success");

    const newMsg: ContactMessage = {
      id: "msg_" + Date.now(),
      name: contactName.trim(),
      email: contactEmail.trim(),
      message: contactMessage.trim(),
      date: new Date().toLocaleString()
    };

    setContactInbox(prev => [newMsg, ...prev]);
    setIsMessageSubmitted(true);
    setContactMessage("");

    triggerNotification("Message sent! Your thoughts represent your real anime voice.");

    setTimeout(() => {
      setIsMessageSubmitted(false);
    }, 7000);
  };



  const handleScrollToSegment = (id: string) => {
    setMobileMenuOpen(false);
    playRetroBeep("click");
    
    let targetPage: "home" | "about" | "explore" | "forums" | "companion" | "contact" = "home";
    if (id === "hero") targetPage = "home";
    else if (id === "about") targetPage = "about";
    else if (id === "explore") targetPage = "explore";
    else if (id === "forums") targetPage = "forums";
    else if (id === "companion" || id === "debates") targetPage = "companion";
    else if (id === "contact") targetPage = "contact";

    setActivePage(targetPage);
    
    // Smooth scroll to top of window instead of anchor
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Filter programs based on query and tab
  const filteredPrograms = programs.filter(item => {
    const matchTab = activeExploreTab === "All" || item.category === activeExploreTab;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                       item.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchQuery;
  });

  // Daily debate votes calculations
  const totalDailyVotes = dailyTopic.votesOptionA + dailyTopic.votesOptionB + dailyTopic.votesOptionC;

  return (
    <div id="otaku_verse_app" className="min-h-screen bg-dark-bg text-gray-200 font-sans custom-grid-bg selection:bg-neon-pink selection:text-white">
      
      {/* GLOWING HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#101026]/90 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* LOGO WITH ANIME NATURE STYLING */}
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-gradient-to-br from-neon-pink to-neon-cyan rounded-lg text-white font-mono animate-pulse shadow-[0_0_15px_rgba(61,140,86,0.4)]">
                🍃
              </span>
              <a 
                onClick={() => handleScrollToSegment("hero")} 
                className="cursor-pointer font-retro text-xl md:text-2xl text-neon-pink hover:text-neon-cyan transition-colors tracking-widest uppercase"
                style={{ textShadow: "0 0 10px rgba(61,140,86,0.6)" }}
              >
                OTAKU VERSE
              </a>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-retro text-[10px] tracking-wider">
              <button 
                onClick={() => handleScrollToSegment("hero")} 
                className={`px-3 py-2 rounded-md transition-colors uppercase border-b-2 ${
                  activePage === "home" 
                    ? "text-neon-pink border-neon-pink bg-white/5 font-bold shadow-[0_2px_10px_rgba(236,72,153,0.15)]" 
                    : "text-gray-300 border-transparent hover:text-neon-pink hover:border-neon-pink"
                }`}
              >
                [Home]
              </button>
              <button 
                onClick={() => handleScrollToSegment("about")} 
                className={`px-3 py-2 rounded-md transition-colors uppercase border-b-2 ${
                  activePage === "about" 
                    ? "text-neon-pink border-neon-pink bg-white/5 font-bold shadow-[0_2px_10px_rgba(236,72,153,0.15)]" 
                    : "text-gray-300 border-transparent hover:text-neon-pink hover:border-neon-pink"
                }`}
              >
                [About]
              </button>
              <button 
                onClick={() => handleScrollToSegment("explore")} 
                className={`px-3 py-2 rounded-md transition-colors uppercase border-b-2 ${
                  activePage === "explore" 
                    ? "text-neon-pink border-neon-pink bg-white/5 font-bold shadow-[0_2px_10px_rgba(236,72,153,0.15)]" 
                    : "text-gray-300 border-transparent hover:text-neon-pink hover:border-neon-pink"
                }`}
              >
                [Find Your Anime]
              </button>
              <button 
                onClick={() => handleScrollToSegment("forums")} 
                className={`px-3 py-2 rounded-md transition-colors uppercase border-b-2 ${
                  activePage === "forums" 
                    ? "text-neon-pink border-neon-pink bg-white/5 font-bold shadow-[0_2px_10px_rgba(236,72,153,0.15)]" 
                    : "text-gray-300 border-transparent hover:text-neon-pink hover:border-neon-pink"
                }`}
              >
                [Listing]
              </button>
              <button 
                onClick={() => handleScrollToSegment("companion")} 
                className={`px-3 py-2 rounded-md transition-colors uppercase border-b-2 ${
                  activePage === "companion" 
                    ? "text-neon-cyan border-neon-cyan bg-white/5 font-bold shadow-[0_2px_10px_rgba(34,211,238,0.15)]" 
                    : "text-gray-300 border-transparent hover:text-neon-cyan hover:border-neon-cyan"
                }`}
              >
                [Find Your Voice]
              </button>
              <button 
                onClick={() => handleScrollToSegment("contact")} 
                className={`px-3 py-2 rounded-lg transition-all uppercase border ${
                  activePage === "contact" 
                    ? "bg-neon-pink text-white border-neon-pink shadow-[0_0_15px_rgba(236,72,153,0.4)]" 
                    : "bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink border-neon-pink/50"
                }`}
              >
                [Join]
              </button>
            </nav>

            {/* MOBILE TOGGLE */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => { playRetroBeep("click"); setMobileMenuOpen(!mobileMenuOpen); }}
                className="p-2 rounded-md text-gray-400 hover:text-neon-pink hover:bg-white/5 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#151535] border-t border-white/10 py-4 px-4 space-y-2 font-retro text-[10px]"
            >
              <button 
                onClick={() => handleScrollToSegment("hero")} 
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  activePage === "home" 
                    ? "bg-neon-pink/20 text-neon-pink font-bold border-l-4 border-neon-pink" 
                    : "text-gray-300 hover:bg-neon-pink/10 hover:text-neon-pink"
                }`}
              >
                [Home]
              </button>
              <button 
                onClick={() => handleScrollToSegment("about")} 
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  activePage === "about" 
                    ? "bg-neon-pink/20 text-neon-pink font-bold border-l-4 border-neon-pink" 
                    : "text-gray-300 hover:bg-neon-pink/10 hover:text-neon-pink"
                }`}
              >
                [About]
              </button>
              <button 
                onClick={() => handleScrollToSegment("explore")} 
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  activePage === "explore" 
                    ? "bg-neon-pink/20 text-neon-pink font-bold border-l-4 border-neon-pink" 
                    : "text-gray-300 hover:bg-neon-pink/10 hover:text-neon-pink"
                }`}
              >
                [Find Your Anime]
              </button>
              <button 
                onClick={() => handleScrollToSegment("forums")} 
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  activePage === "forums" 
                    ? "bg-neon-pink/20 text-neon-pink font-bold border-l-4 border-neon-pink" 
                    : "text-gray-300 hover:bg-neon-pink/10 hover:text-neon-pink"
                }`}
              >
                [Listing]
              </button>
              <button 
                onClick={() => handleScrollToSegment("companion")} 
                className={`block w-full text-left px-4 py-3 rounded-lg ${
                  activePage === "companion" 
                    ? "bg-neon-cyan/20 text-neon-cyan font-bold border-l-4 border-neon-cyan" 
                    : "text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                }`}
              >
                [Find Your Voice]
              </button>
              <button 
                onClick={() => handleScrollToSegment("contact")} 
                className={`block w-full text-center px-4 py-3 rounded-lg font-bold transition-all ${
                  activePage === "contact" 
                    ? "bg-neon-pink text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]" 
                    : "bg-neon-pink/20 text-neon-pink hover:bg-neon-pink hover:text-white"
                }`}
              >
                [Join]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-gradient-to-r from-neon-pink to-neon-cyan p-[1px] rounded-xl shadow-[0_0_20px_rgba(61,140,86,0.4)]"
          >
            <div className="bg-[#0a0e0b] text-white p-4 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center space-x-3">
                <span className="text-xl animate-bounce">🍃</span>
                <p className="font-mono text-xs">{notification}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- HERO SECTION --- */}
              <section id="hero" className="relative py-16 md:py-28 overflow-hidden rounded-3xl bg-[#142217]/70 border border-[#3d8c56]/20 px-6 md:px-12 text-center mb-16 shadow-[0_10px_40px_rgba(10,14,11,0.8)]">
                {/* Subtle moving abstract light rays */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink via-transparent to-transparent"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="inline-block px-3 py-1 bg-neon-pink/15 text-neon-pink rounded-full text-xs font-mono mb-6 uppercase tracking-wider border border-neon-pink/30 shadow-[0_0_10px_rgba(61,140,86,0.2)]">
                      🍃 Anime Nature Sanctuary v2.5
                    </div>
                    
                    <h1 className="font-retro text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 uppercase leading-tight tracking-wide">
                      OTAKU VERSE IS A PLACE TO <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-[#76c893] to-neon-cyan leading-none font-extrabold block mt-3 drop-shadow-[0_2px_10px_rgba(61,140,86,0.5)]">
                        SPEAK YOUR VOICE
                      </span>
                    </h1>
                    
                    <p className="font-sans text-gray-300 text-base md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto font-light">
                      Welcome to our anime forest sanctuary. Discover your next favorite series, explore detailed releases, and find your voice in active anime conversation stages with other fans under the green leaves.
                    </p>

                    {/* RETRO MUSIC EQUALIZER INDICATOR */}
                    <div className="flex items-center justify-center space-x-1.5 h-12 mb-10 bg-[#0a0e0b]/60 max-w-xs mx-auto py-3 px-6 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-[10px] font-mono text-neon-cyan mr-3 uppercase tracking-wider">Atmosphere:</span>
                      {interactiveVisualizer.slice(0, 10).map((h, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 rounded-full bg-gradient-to-t from-neon-pink to-neon-cyan transition-all duration-100 ease-out"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => handleScrollToSegment("companion")} 
                        className="w-full sm:w-auto px-8 py-4 bg-neon-pink hover:bg-neon-pink/90 text-white font-retro text-xs rounded-xl shadow-[0_4px_20px_rgba(61,140,86,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0"
                      >
                        FIND YOUR VOICE
                      </button>
                      <button 
                        onClick={() => handleScrollToSegment("explore")} 
                        className="w-full sm:w-auto px-8 py-4 bg-[#1a2b1f] hover:bg-[#223929] text-gray-200 hover:text-white font-retro text-xs rounded-xl border border-white/10 transition-all transform hover:-translate-y-1"
                      >
                        FIND YOUR ANIME
                      </button>
                    </div>

                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}


          {activePage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- ABOUT SECTION --- */}
              <section id="about" className="py-12 border-t border-b border-white/5 mb-16 scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-[2px] bg-neon-pink"></span>
                      <span className="text-neon-pink text-xs font-mono uppercase tracking-wider">Otaku Origins</span>
                    </div>
                    <h2 className="font-retro text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
                      About Otaku Verse
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                      Otaku Verse was created by fans, for fans. We understand the passion and dedication that comes with being an otaku, and we wanted to build a platform that truly resonates with that spirit. Here, you'll find a welcoming environment to deep-dive into theories, suggest hidden gems, debate character arcs, and connect with fellow enthusiasts who share your love for Japanese animation and comics.
                    </p>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                      Our goal is to foster a dynamic, engaging, and respectful community, providing all the tools you need to share your thoughts, discover new content, and make lasting connections. Join us and let your otaku flag fly!
                    </p>

                    <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-2xl flex items-center space-x-4">
                      <span className="text-3xl text-neon-cyan">🎙️</span>
                      <div>
                        <h4 className="font-retro text-[10px] text-neon-cyan uppercase">Vocal Stages</h4>
                        <p className="text-xs text-gray-400 mt-1">Join or start dynamic voice debate streams, speak your mind, or listen to debates.</p>
                      </div>
                    </div>
                  </div>

                  {/* BENTO GRID FLIGHT OF FEATURES */}
                  <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="bg-[#142217]/50 p-6 rounded-2xl border border-[#3d8c56]/15 hover:border-neon-pink/30 transition-all hover:shadow-[0_4px_25px_rgba(61,140,86,0.15)] group cursor-pointer" onClick={() => handleScrollToSegment("forums")}>
                      <div className="w-10 h-10 bg-neon-pink/10 rounded-xl flex items-center justify-center text-neon-pink mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                        💬
                      </div>
                      <h3 className="font-retro text-[10px] text-white uppercase mb-2">Anime Forums</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Publish theories, rate series, and view what other fan experts recommend around the universe.</p>
                    </div>

                    <div className="bg-[#142217]/50 p-6 rounded-2xl border border-[#3d8c56]/15 hover:border-neon-cyan/30 transition-all hover:shadow-[0_4px_25px_rgba(34,211,238,0.15)] group cursor-pointer" onClick={() => handleScrollToSegment("companion")}>
                      <div className="w-10 h-10 bg-neon-cyan/10 rounded-xl flex items-center justify-center text-neon-cyan mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                        🎙️
                      </div>
                      <h3 className="font-retro text-[10px] text-white uppercase mb-2">Find Your Voice</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Join active voice conversations, take the mic to express your hot takes, or vote on daily topics.</p>
                    </div>

                    <div className="bg-[#142217]/50 p-6 rounded-2xl border border-[#3d8c56]/15 hover:border-neon-pink/30 transition-all hover:shadow-[0_4px_25px_rgba(236,72,153,0.15)] group cursor-pointer" onClick={() => handleScrollToSegment("explore")}>
                      <div className="w-10 h-10 bg-neon-pink/10 rounded-xl flex items-center justify-center text-neon-pink mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                        🔍
                      </div>
                      <h3 className="font-retro text-[10px] text-white uppercase mb-2">Find Your Anime</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Search through our catalog of manga, manhwa, and anime, filter by category or tag, and submit your review.</p>
                    </div>

                    <div className="bg-[#142217]/50 p-6 rounded-2xl border border-[#3d8c56]/15 hover:border-neon-cyan/30 transition-all group cursor-pointer" onClick={() => handleScrollToSegment("explore")}>
                      <div className="bg-[#0a0e0b] p-6 h-full rounded-2xl">
                        <div className="w-10 h-10 bg-neon-cyan/10 rounded-xl flex items-center justify-center text-neon-cyan mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                          🔮
                        </div>
                        <h3 className="font-retro text-[10px] text-slate-100 uppercase mb-2">Manga Catalogue</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Follow popular Manhwa and Manga releases, search details, and customize initial database ratings.</p>
                      </div>
                    </div>

                  </div>

                </div>
              </section>
            </motion.div>
          )}


          {activePage === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- EXPLORE SECTION --- */}
              <section id="explore" className="py-12 scroll-mt-24 mb-16">
                <div className="text-center mb-10">
                  <h2 className="font-retro text-xl sm:text-2xl md:text-3xl text-neon-cyan uppercase mb-4 tracking-tight">
                    Explore the Anime Grove
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                    Discover pristine series categorized to help you find your path, submit your custom rating, and check tags!
                  </p>
                </div>

          {/* Search and Filters Controls */}
          <div className="bg-[#142217]/60 p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {["All", "Manga", "Manhwa", "Anime"].map(cat => (
                <button
                  key={cat}
                  onClick={() => { playRetroBeep("click"); setActiveExploreTab(cat); }}
                  className={`px-4 py-2 text-xs font-retro rounded-xl uppercase transition-all ${
                    activeExploreTab === cat 
                      ? "bg-neon-pink text-white shadow-[0_0_12px_rgba(61,140,86,0.4)]" 
                      : "bg-[#1c2e21] text-gray-400 hover:text-white"
                  }`}
                >
                  {cat === "All" ? "🌿 All" : cat === "Manga" ? "📖 Manga" : cat === "Manhwa" ? "🎨 Manhwa" : "📺 Anime"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search series or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* GRID OF CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPrograms.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#142217]/70 border-l-[5px] border-l-neon-pink border-y border-r border-white/5 rounded-2xl overflow-hidden hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1.5 flex flex-col group h-[480px]"
                >
                  {/* Card Image */}
                  <div className="h-44 relative overflow-hidden bg-slate-900 border-b border-white/10">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#0a0e0b]/90 border border-white/20 text-[10px] font-retro text-neon-cyan uppercase rounded">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 bg-[#0a0e0b]/95 border border-white/10 rounded-full text-xs font-mono text-yellow-400 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 tracking-wide block mb-1">{item.sub}</span>
                      <h3 className="font-retro text-sm text-neon-pink group-hover:text-neon-cyan transition-colors mb-3 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-4">{item.desc}</p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 my-4">
                        {item.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-[#0a0e0b] text-gray-400 rounded text-[9px] font-mono border border-white/5 uppercase hover:text-white hover:border-white/20 transition-all cursor-pointer" onClick={() => setSearchQuery(t)}>
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Interactive rate and view action */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] font-mono text-gray-400">Rate:</span>
                          <div className="flex space-x-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => handleRateProgram(item.id, star)}
                                className="text-gray-500 hover:text-yellow-400 transition-colors"
                                title={`Rate ${star} Stars`}
                              >
                                <Star className="w-3.5 h-3.5 hover:fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => { playRetroBeep("click"); setSelectedProgramId(selectedProgramId === item.id ? null : item.id); }}
                          className="px-3 py-1 bg-neon-cyan/15 hover:bg-neon-cyan/30 text-neon-cyan rounded-lg text-[10px] font-retro border border-neon-cyan/40 transition-colors uppercase"
                        >
                          {selectedProgramId === item.id ? "Close" : "[Voice Log]"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPrograms.length === 0 && (
              <div className="col-span-1 md:col-span-3 bg-[#142217]/40 border border-white/5 rounded-2xl py-16 text-center text-gray-500 space-y-3">
                <p className="font-retro text-xs text-neon-pink animate-pulse">NO SERIES DISCOVERED IN THIS SECTOR OF THE GROVE</p>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">Could not find any items matching "{searchQuery}". Double-check your spelling or click another category tab.</p>
                <button onClick={() => { setSearchQuery(""); setActiveExploreTab("All"); }} className="px-4 py-2 bg-[#1c2e21] text-white text-[10px] font-retro rounded-lg uppercase">Reset Coordinates</button>
              </div>
            )}
          </div>

          {/* Card Detailing Thread block */}
          <AnimatePresence>
            {selectedProgramId && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-8 bg-[#142217] rounded-2xl border-2 border-neon-cyan p-6 shadow-[0_10px_30px_rgba(223,193,155,0.15)] relative"
              >
                <button 
                  onClick={() => { playRetroBeep("click"); setSelectedProgramId(null); }} 
                  className="absolute top-4 right-4 p-1.5 bg-[#0a0e0b] hover:bg-neon-pink rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {(() => {
                  const program = programs.find(p => p.id === selectedProgramId);
                  if (!program) return null;
                  
                  // Query associated discussions
                  const relatedThreads = threads.filter(t => t.category === program.category && t.title.toLowerCase().includes(program.title.toLowerCase().slice(0, 5)));
                  
                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <img 
                          src={program.image} 
                          alt={program.title}
                          referrerPolicy="no-referrer"
                          className="w-full sm:w-48 h-32 object-cover rounded-xl border border-white/20"
                        />
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 bg-neon-cyan/20 border border-neon-cyan/40 text-[9px] font-retro text-neon-cyan rounded uppercase">
                            Exclusive Voice Analysis Log
                          </span>
                          <h3 className="font-retro text-xl text-white uppercase">{program.title}</h3>
                          <p className="text-xs text-gray-400 font-mono mt-1">{program.sub} • Category average: {program.rating} / 5.0⭐</p>
                          <p className="text-xs text-gray-300 leading-relaxed max-w-2xl font-light pt-2">{program.desc}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-retro text-[10px] text-neon-pink uppercase">Associated Community Discussions</h4>
                          <button 
                            onClick={() => {
                              playRetroBeep("click");
                              setNewThreadCategory(program.category);
                              setNewThreadTitle(`Deep theory on ${program.title}`);
                              setShowAddThread(true);
                              handleScrollToSegment("forums");
                            }}
                            className="text-[10px] text-neon-cyan hover:underline flex items-center space-x-1 font-mono"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Start Thread for this item</span>
                          </button>
                        </div>

                        {relatedThreads.length === 0 ? (
                          <div className="bg-[#0a0e0b]/40 p-4 rounded-xl text-center text-xs text-gray-400">
                            No precise theory found. Start the first critical theory on <span className="text-neon-pink font-semibold">{program.title}</span> using the community discussion boards below!
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {relatedThreads.map(rt => (
                              <div 
                                key={rt.id} 
                                onClick={() => { playRetroBeep("click"); setExpandedThreadId(rt.id); handleScrollToSegment("forums"); }}
                                className="p-3 bg-[#0a0e0b]/50 rounded-xl hover:bg-neon-pink/5 cursor-pointer flex items-center justify-between border border-white/5"
                              >
                                <div>
                                  <span className="text-xs text-white hover:underline block">{rt.title}</span>
                                  <span className="text-[10px] text-gray-500 font-mono">By {rt.author} • {rt.replies.length} replies • {rt.likes} upvotes</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-neon-pink" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </motion.div>
            )}
          </AnimatePresence>

        </section>
            </motion.div>
          )}


          {activePage === "forums" && (
            <motion.div
              key="forums"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- COMMUNITY DISCUSSIONS / LISTING SECTION --- */}
              <section id="forums" className="py-12 scroll-mt-24 mb-16 bg-[#142217]/40 border border-white/5 rounded-3xl p-6 md:p-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-neon-pink text-xs font-mono uppercase tracking-wider mb-2">
                <span>💬</span>
                <span>Our Live Forum Listings</span>
              </div>
              <h2 className="font-retro text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
                What Our Community Says
              </h2>
            </div>

            <button
              onClick={() => { playRetroBeep("success"); setShowAddThread(!showAddThread); }}
              className="px-5 py-3 bg-neon-pink hover:bg-neon-pink/90 text-white font-retro text-[10px] rounded-xl flex items-center space-x-2.5 transition-all shadow-[0_4px_15px_rgba(61,140,86,0.3)] select-none uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create New Topic</span>
            </button>
          </div>

          {/* ADD THREAD FORM DRAWER */}
          <AnimatePresence>
            {showAddThread && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#142217] p-6 rounded-2xl border border-neon-pink/40 mb-8 space-y-4 shadow-[0_5px_20px_rgba(61,140,86,0.15)]"
              >
                <div className="flex items-center justify-between-none border-b border-white/5 pb-3">
                  <h3 className="font-retro text-xs text-neon-pink uppercase">Deploy New Anime Debate Topic</h3>
                  <button onClick={() => setShowAddThread(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleCreateThread} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                   <div className="md:col-span-3">
                    <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Category</label>
                    <select
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value as any)}
                      className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-neon-pink"
                    >
                      <option value="Anime">Mortal Anime</option>
                      <option value="Manga">Classic Manga</option>
                      <option value="Manhwa">Webtoon Manhwa</option>
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Your Otaku Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HunterX_99"
                      value={newThreadAuthor}
                      onChange={(e) => setNewThreadAuthor(e.target.value)}
                      className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink"
                    />
                  </div>

                  {/* Avatar Picker */}
                  <div className="md:col-span-4 relative">
                    <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Select Icon Vibe</label>
                    <button
                      type="button"
                      onClick={() => setAvatarMenu(!avatarMenu)}
                      className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white text-left flex items-center justify-between"
                    >
                      <span>{newThreadAvatar} Preset Icon</span>
                      <span>▼</span>
                    </button>
                    {avatarMenu && (
                      <div className="absolute right-0 left-0 mt-1 bg-[#0a0e0b] border border-white/15 rounded-xl p-2.5 grid grid-cols-6 gap-2 z-20 shadow-xl">
                        {["🌸", "🎒", "🔥", "⚔️", "⚡", "🍵", "🦊", "🍜", "🐙", "😈", "🤖", "⭐"].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => { setNewThreadAvatar(emoji); setAvatarMenu(false); }}
                            className="text-xl p-1.5 hover:bg-white/10 rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Topic Header</label>
                    <input
                      type="text"
                      required
                      placeholder="Give a compelling, punchy title to inspire theories..."
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                      className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Detailed Speculations / Review Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your long thoughts cataloging chapters, animations, plot progression, or theories..."
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                      className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink resize-none"
                    ></textarea>
                  </div>

                  <div className="md:col-span-12 flex justify-end space-x-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddThread(false)}
                      className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-[10px] font-retro"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-neon-pink hover:bg-neon-pink/90 text-white font-retro text-[10px] rounded-xl uppercase"
                    >
                      Enlist Thread 🚀
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE DISCUSSIONS FEED */}
          <div className="space-y-4">
            {threads.map(thread => {
              const isExpanded = expandedThreadId === thread.id;
              
              return (
                <div 
                  key={thread.id}
                  className={`bg-[#142217]/50 border rounded-2xl transition-all duration-300 ${
                    isExpanded 
                      ? "border-neon-cyan shadow-[0_4px_25px_rgba(223,193,155,0.15)] p-6" 
                      : "border-white/5 hover:border-white/15 p-4 md:p-5 hover:bg-[#1a2d1f]/50"
                  }`}
                >
                  
                  {/* Collapsed Feed Header */}
                  <div 
                    onClick={() => { playRetroBeep("click"); setExpandedThreadId(isExpanded ? null : thread.id); }}
                    className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      
                      {/* Avatar/Emoji banner */}
                      <span className="w-12 h-12 bg-[#0a0e0b] rounded-xl flex items-center justify-center text-3xl shadow-sm border border-white/10 shrink-0">
                        {thread.avatarUrl || "🌸"}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-[#0a0e0b] border border-white/10 text-[8px] font-retro text-neon-pink uppercase rounded whitespace-nowrap">
                            {thread.category}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">By {thread.author} • {thread.date}</span>
                        </div>
                        <h3 className="font-retro text-xs sm:text-sm text-white group-hover:text-neon-pink transition-colors pr-4 leading-normal select-text">
                          {thread.title}
                        </h3>
                        {!isExpanded && (
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-2xl text-ellipsis select-text">
                            {thread.content}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Upvote & Comment Counters */}
                    <div className="flex items-center space-x-4 self-end md:self-center shrink-0">
                      
                      <button 
                        onClick={(e) => handleLikeThread(thread.id, e)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-[#0a0e0b] border border-white/10 hover:border-neon-pink rounded-xl text-xs text-gray-300 hover:text-neon-pink transition-all font-mono"
                        title="Awesome theoretical upvote"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-neon-pink" />
                        <span>{thread.likes}</span>
                      </button>

                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0a0e0b]/40 rounded-xl text-xs text-gray-400 font-mono">
                        <MessageSquare className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>{thread.replies.length} replies</span>
                      </div>

                      <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-90 text-neon-cyan" : ""}`} />

                    </div>
                  </div>

                  {/* Expanded Thread details and replies */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                      
                      {/* Deep text block */}
                      <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light pl-2 border-l-2 border-neon-cyan whitespace-pre-line select-text">
                        {thread.content}
                      </p>

                      {/* Thread Replies List */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <h4 className="font-retro text-[9px] text-neon-cyan uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                          <span>Replies ({thread.replies.length})</span>
                        </h4>

                        {thread.replies.map(reply => (
                          <div key={reply.id} className="p-4 bg-[#0a0e0b]/75 rounded-2xl border border-white/5 space-y-2 relative">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">{reply.avatarUrl || "🦊"}</span>
                                <span className="text-xs font-bold text-neon-pink">{reply.author}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">{reply.date}</span>
                            </div>
                            <p className="text-xs text-gray-300 pl-8 leading-relaxed font-light select-text">{reply.content}</p>
                          </div>
                        ))}

                        {thread.replies.length === 0 && (
                          <p className="text-xs text-gray-500 italic pl-2">No replies yet. Speak your voice and formulate the very first response!</p>
                        )}
                      </div>

                      {/* Reply Submission Input */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Add your insightful reply comment..."
                            value={newReplyText}
                            onChange={(e) => setNewReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddReply(thread.id); }}
                            className="flex-1 bg-[#0a0e0b] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                          />
                          <button
                            onClick={() => handleAddReply(thread.id)}
                            className="px-4 py-2 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-semibold text-xs rounded-xl flex items-center space-x-1 uppercase transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reply</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </section>
            </motion.div>
          )}


          {activePage === "companion" && (
            <motion.div
              key="companion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- LIVE ANIME DEBATES & CONVERSATION SESSIONS --- */}
              <section id="debates" className="py-12 scroll-mt-24 mb-16">
                
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-2 bg-neon-cyan/10 border border-neon-cyan/20 px-3 py-1 rounded-full text-xs text-neon-cyan font-mono uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></span>
                    <span>Live Sanctuary Forums & Call Stages</span>
                  </div>
                  <h2 className="font-retro text-xl sm:text-2xl md:text-3xl text-neon-pink uppercase mb-3 tracking-tight">
                    Live Discussion & Debate Stages
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto">
                    Take the mic, state your stance, or sit back as an active listener. Engage in real-time vocal arguments with other otaku, dynamically powered by Gemini AI.
                  </p>
                </div>

                {/* DAILY DEBATE TOPIC PANEL */}
                <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-[#121230] to-[#1a1438] p-6 rounded-3xl border border-neon-pink/20 shadow-[0_0_25px_rgba(236,72,153,0.1)]">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-0.5 bg-neon-pink text-white text-[9px] font-retro rounded uppercase">Daily Sanctuary Topic</span>
                    <span className="text-xs text-gray-400 font-mono">ID: {dailyTopic.id}</span>
                  </div>
                  <h3 className="text-base sm:text-lg text-white font-bold tracking-tight mb-2">
                    {dailyTopic.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
                    {dailyTopic.description}
                  </p>

                  {/* Options Voting Grid */}
                  <div className="space-y-4">
                    {[
                      { key: "A", label: dailyTopic.optionA, votes: dailyTopic.votesOptionA, pct: totalDailyVotes > 0 ? Math.round((dailyTopic.votesOptionA / (dailyTopic.votesOptionA + dailyTopic.votesOptionB + dailyTopic.votesOptionC)) * 100) : 0 },
                      { key: "B", label: dailyTopic.optionB, votes: dailyTopic.votesOptionB, pct: totalDailyVotes > 0 ? Math.round((dailyTopic.votesOptionB / (dailyTopic.votesOptionA + dailyTopic.votesOptionB + dailyTopic.votesOptionC)) * 100) : 0 },
                      { key: "C", label: dailyTopic.optionC, votes: dailyTopic.votesOptionC, pct: totalDailyVotes > 0 ? Math.round((dailyTopic.votesOptionC / (dailyTopic.votesOptionA + dailyTopic.votesOptionB + dailyTopic.votesOptionC)) * 100) : 0 }
                    ].map(opt => {
                      const hasVoted = userDailyVote !== null;
                      const isUserVote = userDailyVote === opt.key;
                      
                      return (
                        <div 
                          key={opt.key}
                          onClick={() => !hasVoted && handleVoteDailyTopic(opt.key as "A" | "B" | "C")}
                          className={`relative p-4 rounded-xl border cursor-pointer select-none overflow-hidden transition-all ${
                            isUserVote 
                              ? "bg-neon-pink/15 border-neon-pink" 
                              : hasVoted 
                                ? "bg-white/2 border-white/5 opacity-80 cursor-default" 
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                          }`}
                        >
                          {/* Animated vote percentage background bar */}
                          {hasVoted && (
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${opt.pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute top-0 left-0 bottom-0 bg-neon-pink/10 pointer-events-none"
                            />
                          )}

                          <div className="relative flex justify-between items-center text-xs sm:text-sm">
                            <div className="flex items-center space-x-3 pr-4">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-retro text-[10px] ${
                                isUserVote 
                                  ? "bg-neon-pink text-white" 
                                  : "bg-[#0a0e0b] text-gray-400 border border-white/10"
                              }`}>
                                {opt.key}
                              </span>
                              <span className="font-medium text-white">{opt.label}</span>
                              {isUserVote && <span className="text-[9px] font-mono text-neon-pink uppercase font-bold">[Your Vote]</span>}
                            </div>
                            
                            {hasVoted && (
                              <div className="text-right font-mono text-xs shrink-0">
                                <span className="text-white font-bold">{opt.pct}%</span>
                                <span className="text-gray-500 text-[10px] ml-1.5">({opt.votes} votes)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ROOM NAVIGATION / ACTIVE INTERFACE */}
                {activeRoomId === null ? (
                  /* --- LOBBY VIEW --- */
                  <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
                      <div>
                        <h4 className="font-retro text-xs text-neon-cyan uppercase tracking-wider mb-1">Live Directory</h4>
                        <p className="text-gray-400 text-xs">Browse ongoing voice discussions or launch a custom discussion.</p>
                      </div>
                      <button
                        onClick={() => { playRetroBeep("click"); setShowCreateRoomModal(true); }}
                        className="px-5 py-2 bg-gradient-to-r from-neon-pink to-neon-cyan hover:brightness-110 text-white font-retro text-[9px] uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Launch Debate Call
                      </button>
                    </div>

                    {/* CREATE ROOM MODAL INLINE EXPANSION */}
                    {showCreateRoomModal && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0f0f26] border-2 border-neon-pink p-6 rounded-2xl mb-8 max-w-2xl mx-auto shadow-2xl"
                      >
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                          <h4 className="font-retro text-xs text-white uppercase tracking-wider">Initialize Live Stage Call</h4>
                          <button 
                            onClick={() => setShowCreateRoomModal(false)}
                            className="text-gray-400 hover:text-white font-mono text-sm"
                          >
                            [X]
                          </button>
                        </div>
                        <form onSubmit={handleCreateLiveRoom} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 uppercase tracking-wider mb-1 text-[9px] font-retro">Room Title:</label>
                              <input 
                                type="text"
                                required
                                value={createRoomTitle}
                                onChange={e => setCreateRoomTitle(e.target.value)}
                                placeholder="e.g., Bleach TYBW vs Demon Slayer"
                                className="w-full bg-[#141433] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-pink"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 uppercase tracking-wider mb-1 text-[9px] font-retro">Discussion Category:</label>
                              <select 
                                value={createRoomType}
                                onChange={e => setCreateRoomType(e.target.value as "Debate" | "Casual")}
                                className="w-full bg-[#141433] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-pink"
                              >
                                <option value="Debate">Structured Debate Stage</option>
                                <option value="Casual">Casual Chitchat Stage</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-400 uppercase tracking-wider mb-1 text-[9px] font-retro">Daily / Custom Debate Topic:</label>
                            <input 
                              type="text"
                              required
                              value={createRoomTopic}
                              onChange={e => setCreateRoomTopic(e.target.value)}
                              placeholder="State the central query to discuss..."
                              className="w-full bg-[#141433] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-pink"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 uppercase tracking-wider mb-1 text-[9px] font-retro">Topic Tags (comma separated):</label>
                              <input 
                                type="text"
                                value={createRoomTags}
                                onChange={e => setCreateRoomTags(e.target.value)}
                                placeholder="Anime, Shonen, Lore"
                                className="w-full bg-[#141433] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-pink"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 uppercase tracking-wider mb-1 text-[9px] font-retro">Your Debate Stance (optional):</label>
                              <input 
                                type="text"
                                value={createRoomStance}
                                onChange={e => setCreateRoomStance(e.target.value)}
                                placeholder="e.g., Sub Only, Zoro fan..."
                                className="w-full bg-[#141433] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-pink"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowCreateRoomModal(false)}
                              className="px-4 py-2 border border-white/10 rounded-xl text-gray-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gradient-to-r from-neon-pink to-neon-cyan text-white font-retro text-[9px] uppercase rounded-xl"
                            >
                              Broadcast Stage
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Directory list of rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {liveRooms.map(room => (
                        <div 
                          key={room.id}
                          className="bg-[#101026] p-5 rounded-2xl border border-white/5 hover:border-neon-pink/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest ${
                                room.type === "Debate" 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {room.type} Stage
                              </span>
                              <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 shrink-0 font-mono">
                                <Users className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
                                <span>{room.listenersCount} listening</span>
                              </div>
                            </div>

                            <h4 className="font-retro text-xs text-white uppercase mb-2 tracking-wide leading-tight">
                              {room.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 font-light mb-4 leading-normal line-clamp-3">
                              {room.topic}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {room.tags.map((tag, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] text-gray-400 uppercase font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-full bg-[#0a0e0b] border border-white/10 flex items-center justify-center text-sm">
                                {room.hostAvatar}
                              </span>
                              <div>
                                <span className="text-[9px] text-gray-500 block uppercase font-mono">Hosted by</span>
                                <span className="text-[10px] text-white font-medium block leading-none">{room.host}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                playRetroBeep("click");
                                setActiveRoomId(room.id);
                                setIsRoomSpeaker(false); // Join as listener by default
                                setUserStance("");
                                triggerNotification(`Connecting voice link... Joined "${room.title}"!`);
                              }}
                              className="px-4 py-2 border border-neon-cyan hover:bg-neon-cyan/15 text-neon-cyan font-retro text-[8px] uppercase tracking-wider rounded-xl transition-all"
                            >
                              Join Call Stage
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* --- CALL ACTIVE VIEW --- */
                  (() => {
                    const room = liveRooms.find(r => r.id === activeRoomId);
                    if (!room) return null;

                    return (
                      <div className="max-w-6xl mx-auto">
                        {/* Call Stage Header Banner */}
                        <div className="bg-[#0a0e0b] px-6 py-4 rounded-3xl border border-white/10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
                          <div className="flex items-center space-x-4">
                            <span className="w-12 h-12 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-full flex items-center justify-center text-xl animate-pulse shrink-0 font-mono">
                              🎙️
                            </span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] uppercase tracking-widest font-mono rounded-full border border-green-500/30">Streaming Live</span>
                                <span className="text-xs text-gray-500 font-mono">Room ID: {room.id}</span>
                              </div>
                              <h3 className="font-retro text-xs text-white uppercase tracking-wider">{room.title}</h3>
                              <p className="text-[10px] text-neon-cyan leading-relaxed">Topic: {room.topic}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <button
                              onClick={() => {
                                playRetroBeep("click", 0.7);
                                setActiveRoomId(null);
                                triggerNotification("Disconnected from call stage.");
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-retro text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md"
                            >
                              Disconnect Call
                            </button>
                          </div>
                        </div>

                        {/* Split Stage Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                          
                          {/* STAGE & PARTICIPANTS PANELS (Cols 5) */}
                          <div className="lg:col-span-5 flex flex-col gap-6">
                            
                            {/* Speakers Stage Block */}
                            <div className="bg-[#101026] p-5 rounded-3xl border border-white/10 space-y-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[9px] font-retro text-neon-pink uppercase tracking-wider">Speakers Stage ({room.participants.filter(p => p.role !== "listener").length + (isRoomSpeaker ? 1 : 0)})</span>
                                <span className="text-[10px] text-gray-500 font-mono">Audio Sync: Online</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {/* Simulated Active Speakers */}
                                {room.participants
                                  .filter(p => p.role === "host" || p.role === "speaker")
                                  .map((p, i) => {
                                    const isSpeakerYourself = p.name === "You" || p.name === "You (Host)";
                                    if (isSpeakerYourself && isRoomSpeaker) return null; // We will render "You" separately below
                                    
                                    return (
                                      <div 
                                        key={i}
                                        className={`p-3 rounded-2xl border transition-all relative overflow-hidden flex flex-col items-center justify-center text-center bg-[#070714] ${
                                          p.isSpeaking 
                                            ? "border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-102" 
                                            : "border-white/5"
                                        }`}
                                      >
                                        {/* Speaking green halo pulse */}
                                        {p.isSpeaking && (
                                          <span className="absolute top-2 right-2 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                          </span>
                                        )}

                                        <span className={`w-11 h-11 bg-[#0f0f26] rounded-2xl border border-white/10 flex items-center justify-center text-2xl mb-2 ${
                                          p.isSpeaking ? "animate-bounce" : ""
                                        }`}>
                                          {p.avatar}
                                        </span>
                                        <h5 className="text-[11px] font-bold text-white uppercase leading-none font-retro mb-1">
                                          {p.name}
                                        </h5>
                                        {p.stance && (
                                          <span className="text-[8px] bg-white/5 border border-white/10 text-neon-cyan px-1.5 py-0.5 rounded uppercase font-mono max-w-full truncate block leading-none">
                                            {p.stance}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}

                                {/* User Speaker Card (if user is speaker) */}
                                {isRoomSpeaker && (
                                  <div className="p-3 rounded-2xl border border-neon-pink bg-neon-pink/5 relative flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                                    <span className="absolute top-2 right-2 flex h-2 w-2">
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink"></span>
                                    </span>
                                    <span className="w-11 h-11 bg-neon-pink text-white rounded-2xl border border-neon-pink/20 flex items-center justify-center text-2xl mb-2">
                                      👑
                                    </span>
                                    <h5 className="text-[11px] font-bold text-white uppercase leading-none font-retro mb-1">
                                      You
                                    </h5>
                                    <span className="text-[8px] bg-neon-pink/20 border border-neon-pink/30 text-neon-pink px-1.5 py-0.5 rounded uppercase font-mono max-w-full truncate block leading-none">
                                      {userStance || "Host / Pro-Topic"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Stage Actions buttons */}
                              <div className="pt-2 border-t border-white/5 flex gap-2">
                                {!isRoomSpeaker ? (
                                  <button
                                    onClick={() => {
                                      playRetroBeep("success");
                                      setIsRoomSpeaker(true);
                                      const stance = prompt("Define your stance to take the mic stage (e.g., Sub Elitist, Goku Fan):", "Dub Enjoyer") || "Stance Member";
                                      setUserStance(stance);
                                      triggerNotification("You have taken the mic and joined the Stage! 🎙️");
                                    }}
                                    className="flex-1 py-2 border border-neon-pink/50 bg-neon-pink/5 text-neon-pink text-[9px] font-retro uppercase rounded-xl hover:bg-neon-pink hover:text-white transition-all text-center block"
                                  >
                                    [Take Stage Mic 🎙️]
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      playRetroBeep("click");
                                      setIsRoomSpeaker(false);
                                      triggerNotification("Returned to active audience seat.");
                                    }}
                                    className="flex-1 py-2 border border-white/10 text-gray-400 text-[9px] font-retro uppercase rounded-xl hover:text-white transition-all text-center block"
                                  >
                                    [Mute Mic / Go to Seats]
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Audience Seat View */}
                            <div className="bg-[#101026] p-5 rounded-3xl border border-white/10 space-y-3 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-retro text-neon-cyan uppercase tracking-wider block border-b border-white/5 pb-2 mb-3">
                                  Audience Seats ({room.participants.filter(p => p.role === "listener").length + (!isRoomSpeaker ? 1 : 0)})
                                </span>

                                <div className="flex flex-wrap gap-2.5">
                                  {room.participants
                                    .filter(p => p.role === "listener")
                                    .map((p, i) => (
                                      <div key={i} className="flex items-center space-x-1.5 bg-white/2 border border-white/5 px-2.5 py-1.5 rounded-xl font-mono text-[10px]" title={p.name}>
                                        <span className="text-xs shrink-0">{p.avatar}</span>
                                        <span className="text-gray-300 font-light truncate max-w-[70px]">{p.name}</span>
                                      </div>
                                    ))}

                                  {/* You as Audience */}
                                  {!isRoomSpeaker && (
                                    <div className="flex items-center space-x-1.5 bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-1.5 rounded-xl font-mono text-[10px]" title="You (Listening)">
                                      <span className="text-xs shrink-0">🍿</span>
                                      <span className="text-neon-cyan font-bold truncate max-w-[70px]">You</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-[#070714] p-4 rounded-2xl border border-white/5 mt-4">
                                <span className="text-[9px] font-retro text-gray-500 uppercase block mb-1">Quick Instructions</span>
                                <p className="text-[10px] text-gray-400 leading-normal font-light">
                                  Type your thoughts in the chat to add arguments. The active debaters are simulated with high contextual intelligence and will speak back!
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* ACTIVE TRANSCRIPT & TEXT ENGINE (Cols 7) */}
                          <div className="lg:col-span-7 flex flex-col bg-[#101026] rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-[560px] relative">
                            
                            {/* Floating Emoji Reactions Layer */}
                            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                              <AnimatePresence>
                                {spawnedReactions.map(react => (
                                  <motion.span
                                    key={react.id}
                                    initial={{ opacity: 1, y: 350, scale: 0.8 }}
                                    animate={{ opacity: 0, y: 0, scale: 1.6, x: (Math.random() - 0.5) * 120 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2.2, ease: "easeOut" }}
                                    className="absolute text-3xl pointer-events-none select-none"
                                    style={react.style}
                                  >
                                    {react.emoji}
                                  </motion.span>
                                ))}
                              </AnimatePresence>
                            </div>

                            {/* Stage Live Log Header */}
                            <div className="bg-[#0a0e0b] px-6 py-3 border-b border-white/10 flex justify-between items-center">
                              <span className="text-[10px] font-retro text-white uppercase flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                Live Debate Transcript & Chats
                              </span>

                              <button
                                onClick={handlePromptNextArgument}
                                disabled={isSimulatedDebaterResponding}
                                className="px-3 py-1 bg-white/5 hover:bg-neon-cyan/15 text-[9px] font-retro border border-white/10 hover:border-neon-cyan text-gray-300 hover:text-neon-cyan rounded-lg uppercase tracking-wider transition-all"
                              >
                                [Prompt Next Speaker 🗣️]
                              </button>
                            </div>

                            {/* Chat messages log list */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 focus:outline-none scrollbar-thin scrollbar-thumb-neon-pink scroll-smooth">
                              {room.messages.map((msg, idx) => {
                                const isUser = msg.author === "You";
                                const isSystem = msg.author === "System Bot";

                                if (isSystem) {
                                  return (
                                    <div key={idx} className="text-center py-2">
                                      <span className="px-3 py-1 bg-[#0a0e0b]/80 text-[10px] font-mono text-neon-cyan rounded-xl border border-white/5">
                                        🤖 {msg.content}
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <div 
                                    key={idx}
                                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-3`}
                                  >
                                    {!isUser && (
                                      <span className="w-8 h-8 rounded-full bg-[#0a0e0b] border border-white/10 flex items-center justify-center text-sm shrink-0">
                                        {msg.avatar}
                                      </span>
                                    )}

                                    <div className="max-w-[85%] space-y-0.5">
                                      <div className={`flex items-center gap-1.5 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                                        <span className="text-[9px] font-retro text-gray-300 uppercase leading-none">
                                          {msg.author}
                                        </span>
                                        <span className="text-[8px] font-mono text-gray-500 leading-none">
                                          {msg.timestamp}
                                        </span>
                                      </div>

                                      <div className={`p-3.5 rounded-2xl leading-relaxed text-xs border relative ${
                                        isUser 
                                          ? "bg-neon-pink text-white border-neon-pink/40 rounded-tr-none" 
                                          : "bg-[#0a0e0b]/90 text-gray-200 border-white/5 rounded-tl-none"
                                      }`}>
                                        <p className="font-light">{msg.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Debater responder typing loader */}
                              {isSimulatedDebaterResponding && (
                                <div className="flex justify-start items-center space-x-2 text-xs text-neon-cyan animate-pulse py-2 pl-3">
                                  <span className="text-lg animate-spin">☕</span>
                                  <span className="font-retro text-[9px] uppercase tracking-widest text-neon-cyan">
                                    Participant taking the stage mic...
                                  </span>
                                </div>
                              )}

                              <div ref={chatEndRef} />
                            </div>

                            {/* Floating emoji reaction trigger board */}
                            <div className="bg-[#0c0c1e] px-4 py-2 border-t border-white/5 flex justify-center items-center gap-3">
                              <span className="text-[9px] font-retro text-gray-500 uppercase tracking-wider shrink-0">Send Reaction:</span>
                              <div className="flex gap-2">
                                {["🔥", "👏", "💯", "👀", "🤯", "😂"].map(emo => (
                                  <button
                                    key={emo}
                                    onClick={() => handleSpawnReaction(emo)}
                                    className="w-8 h-8 bg-[#141433] hover:bg-[#1f1f4c] text-sm flex items-center justify-center rounded-xl border border-white/5 hover:border-white/15 transition-all hover:scale-110 active:scale-95"
                                  >
                                    {emo}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Input Form Box */}
                            <form onSubmit={handleSendDebateMessage} className="p-4 bg-[#0a0e0b] border-t border-white/10 flex gap-3">
                              <input
                                type="text"
                                value={roomChatInput}
                                onChange={e => setRoomChatInput(e.target.value)}
                                placeholder={isRoomSpeaker ? "Enter your point, stance, or anime theory..." : "Request stage mic to speak, or text to transcript..."}
                                className="flex-1 bg-[#141433] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
                              />
                              <button
                                type="submit"
                                disabled={!roomChatInput.trim()}
                                className="px-5 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center font-retro text-[9px] uppercase tracking-wider shadow-lg shrink-0"
                              >
                                <Send className="w-3.5 h-3.5 text-white mr-1.5" />
                                <span>Transmit</span>
                              </button>
                            </form>

                          </div>

                        </div>
                      </div>
                    );
                  })()
                )}

              </section>
            </motion.div>
          )}






          {activePage === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {/* --- CONTACT / INBOX MANAGEMENT SECTION --- */}
              <section id="contact" className="py-12 scroll-mt-24 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTACT INFO (Cols 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2 text-neon-pink text-xs font-mono uppercase tracking-wider">
              <span>📧</span>
              <span>Connect Beyond the Screen</span>
            </div>
            
            <h2 className="font-retro text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              Join the Conversation
            </h2>
            
            <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light">
              Have burning inquiries, deep-space suggestions, comic feedback, or simply want to speak your greetings directly to the administrator council? Fill the form, and send!
            </p>
            <p className="text-gray-400 text-xs">
              Mails will instantly post to our localized system register. We review every message left!
            </p>

            {/* INBOX SUBMISSIONS PREVIEW */}
            <div className="bg-[#0a0e0b]/90 p-5 rounded-2xl border border-white/10 space-y-4 shadow-inner">
              <span className="font-retro text-[9px] text-[#00bcd4] uppercase block">Sent Message Registry Logs ({contactInbox.length}):</span>
              
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {contactInbox.map(item => (
                  <div key={item.id} className="p-3 bg-[#142217]/60 border border-white/5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono">
                      <span>From: {item.name}</span>
                      <span>{item.date.split(",")[0]}</span>
                    </div>
                    <p className="text-xs text-white font-medium italic">"{item.message}"</p>
                    <div className="text-[9px] font-semibold text-neon-pink">Status: Transmitted successfully</div>
                  </div>
                ))}

                {contactInbox.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No messages sent yet. Put down your thought, send, and check back to see logs registry fill up!</p>
                )}
              </div>
            </div>

          </div>

          {/* CONTACT INPUT FORM (Cols 7) */}
          <div className="lg:col-span-7 bg-[#142217]/50 p-6 md:p-8 rounded-3xl border-l-[6px] border-l-neon-pink border-y border-r border-white/10">
            
            {isMessageSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-neon-cyan/15 text-neon-cyan rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg border border-neon-cyan/40">
                  ✓
                </div>
                <h3 className="font-retro text-sm text-neon-cyan uppercase">Transmitted Into Orbit!</h3>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, Otaku friend! Your direct anime voice review has been cataloged into our local core storage database. Keep sharing!
                </p>
                <div className="text-xs text-neon-pink font-semibold animate-pulse">Wait 5 seconds to load up the form again...</div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                
                <h3 className="font-retro text-xs text-neon-pink uppercase mb-2">Otaku Verse Mailer Interface</h3>
                
                <div>
                  <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Otaku Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your real name or anime alias"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-neon-pink transition-colors placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-neon-pink transition-colors placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-retro text-neon-cyan uppercase mb-2">Thoughts or Suggestions Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What's currently on your otaku mind? Share feedback, theories, bugs, or requests..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#0a0e0b] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-neon-pink transition-colors placeholder-gray-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-neon-pink hover:bg-neon-pink/90 text-white font-retro text-xs rounded-xl shadow-lg transition-all"
                >
                  SEND VOICE MESSAGE
                </button>

              </form>
            )}

          </div>

        </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FOOTER AT BOTTOM --- */}
      <footer className="bg-footer-bg border-t border-white/10 py-12 text-center text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          
          <div className="flex items-center justify-center space-x-3">
            <span className="font-retro text-base text-neon-pink uppercase">OTAKU VERSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase">By Fans, For Fans</span>
          </div>

          <p className="max-w-md mx-auto leading-relaxed text-[11px] font-light">
            © 2026 Otaku Verse. All rights reserved. Celebrating the burning spirit of Manga, Manhwa, and Japanese Animation legends. Powered by Gemini.
          </p>

          <div className="flex justify-center space-x-6 text-[10px] font-retro uppercase">
            <a onClick={() => handleScrollToSegment("hero")} className="hover:text-neon-pink cursor-pointer">Home</a>
            <a onClick={() => handleScrollToSegment("about")} className="hover:text-neon-pink cursor-pointer">About</a>
            <a onClick={() => handleScrollToSegment("explore")} className="hover:text-neon-pink cursor-pointer">Find Your Anime</a>
            <a onClick={() => handleScrollToSegment("forums")} className="hover:text-neon-pink cursor-pointer">Listing</a>
            <a onClick={() => handleScrollToSegment("companion")} className="hover:text-neon-pink cursor-pointer">Find Your Voice</a>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/5">
            <span className="text-[9px] font-mono text-gray-600 uppercase">Interactive Synthesizer Status: Active</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
