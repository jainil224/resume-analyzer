import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Loader2, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

// 3D Robot Avatar Component
function Robot3DAvatar({ isHovered, mouseX, mouseY }: { isHovered: boolean; mouseX: number; mouseY: number }) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  
  // Calculate eye movement based on mouse position
  const eyeOffsetX = (mouseX - 0.5) * 6;
  const eyeOffsetY = (mouseY - 0.5) * 4;

  return (
    <motion.div 
      className="relative w-20 h-20 cursor-pointer"
      animate={{
        rotateY: (mouseX - 0.5) * 20,
        rotateX: -(mouseY - 0.5) * 15,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Robot Head - Main sphere */}
      <motion.div 
        className="absolute inset-0 rounded-full shadow-2xl"
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)",
          boxShadow: isDark 
            ? "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.2)"
            : "0 8px 32px rgba(0,0,0,0.15), inset 0 2px 8px rgba(255,255,255,0.8)"
        }}
      >
        {/* Face visor/mask */}
        <motion.div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[45%] rounded-full"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
            boxShadow: isDark 
              ? "inset 0 2px 8px rgba(0,0,0,0.5)"
              : "inset 0 2px 8px rgba(0,0,0,0.3)"
          }}
        >
          {/* Left Eye */}
          <motion.div 
            className="absolute left-[18%] top-1/2 -translate-y-1/2 w-[28%] h-[55%] rounded-full"
            style={{
              background: "linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 100%)",
              boxShadow: "0 0 12px hsl(var(--primary)/0.6), inset 0 1px 2px rgba(255,255,255,0.3)"
            }}
            animate={{
              x: eyeOffsetX,
              y: eyeOffsetY,
              scale: isHovered ? 1.1 : 1
            }}
          >
            {/* Eye highlight */}
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60" />
          </motion.div>
          
          {/* Right Eye */}
          <motion.div 
            className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[28%] h-[55%] rounded-full"
            style={{
              background: "linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 100%)",
              boxShadow: "0 0 12px hsl(var(--primary)/0.6), inset 0 1px 2px rgba(255,255,255,0.3)"
            }}
            animate={{
              x: eyeOffsetX,
              y: eyeOffsetY,
              scale: isHovered ? 1.1 : 1
            }}
          >
            {/* Eye highlight */}
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
        
        {/* Top circle detail */}
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2"
          style={{ borderColor: "hsl(var(--primary)/0.4)" }}
        />
        
        {/* Left antenna */}
        <motion.div 
          className="absolute -left-1 top-1/4 w-2 h-4 rounded-full"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #475569 0%, #1e293b 100%)"
              : "linear-gradient(180deg, #64748b 0%, #475569 100%)"
          }}
          animate={{ rotate: isHovered ? -10 : 0 }}
        />
        
        {/* Right antenna */}
        <motion.div 
          className="absolute -right-1 top-1/4 w-2 h-4 rounded-full"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #475569 0%, #1e293b 100%)"
              : "linear-gradient(180deg, #64748b 0%, #475569 100%)"
          }}
          animate={{ rotate: isHovered ? 10 : 0 }}
        />
        
        {/* Decorative lines */}
        <div 
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-px h-2 rounded-full"
          style={{ background: "hsl(var(--primary)/0.5)" }}
        />
      </motion.div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.3) 0%, transparent 70%)"
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.3 : 1
        }}
      />
    </motion.div>
  );
}

export function Robot3DChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (robotRef.current) {
        const rect = robotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalize mouse position relative to robot center (0-1 range)
        const x = Math.max(0, Math.min(1, (e.clientX - centerX + 200) / 400));
        const y = Math.max(0, Math.min(1, (e.clientY - centerY + 200) / 400));
        
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setMessages([
      {
        role: "assistant",
        content: "👋 Hi! I'm your AI Resume Assistant. I can help you with:\n\n📄 **Resume Writing** - Creating compelling, ATS-friendly resumes\n💼 **Interview Prep** - Practice questions and techniques\n🎯 **Career Guidance** - Finding your career direction\n\nHow can I help you today?",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, createdAt: new Date().toISOString() }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantBuffer = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "", createdAt: new Date().toISOString() }]);

        let done = false;
        let buffer = "";
        while (!done) {
          const { value, done: readDone } = await reader.read();
          if (readDone) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (!line.trim()) continue;
            if (!line.startsWith("data: ")) continue;

            const data = line.replace(/^data: /, "").trim();
            if (data === "[DONE]") {
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantBuffer += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  const lastIndex = copy.map((m) => m.role).lastIndexOf("assistant");
                  if (lastIndex >= 0) {
                    copy[lastIndex] = { ...copy[lastIndex], content: assistantBuffer };
                  }
                  return copy;
                });
              }
            } catch (err) {
              // ignore parse errors
            }
          }
        }
      } else {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || JSON.stringify(json);
        setMessages((prev) => [...prev, { role: "assistant", content, createdAt: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error("Assistant error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry — there was an error. Please try again.", createdAt: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyText = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
    } catch (e) {
      console.warn("Clipboard not available", e);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <>
      {/* 3D Robot Button - Always visible at bottom right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            ref={robotRef}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOpen}
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Robot3DAvatar 
                isHovered={isHovered} 
                mouseX={mousePosition.x} 
                mouseY={mousePosition.y} 
              />
            </motion.div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                    <span className="text-sm font-medium text-foreground">Chat with AI Assistant</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-xl border-border overflow-hidden">
              {/* Header with mini robot */}
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative">
                    <Robot3DAvatar isHovered={false} mouseX={0.5} mouseY={0.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
                    <p className="text-xs text-primary-foreground/70">Resume & Career Expert</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-primary-foreground hover:bg-primary-foreground/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[350px] p-4">
                <div ref={scrollRef} className="space-y-3">
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex gap-2 max-w-[85%] group">
                        {m.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className={`rounded-xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <div className="flex flex-col gap-1">
                            <div className={`text-sm ${m.role === "assistant" ? "prose prose-sm max-w-none dark:prose-invert" : ""}`}>
                              {m.role === "assistant" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || ""}</ReactMarkdown>
                              ) : (
                                <p className="whitespace-pre-wrap">{m.content}</p>
                              )}
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                              {m.createdAt && (
                                <span className="text-[11px] opacity-60">
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                              <button
                                title="Copy message"
                                aria-label="Copy message"
                                onClick={() => copyText(m.content)}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                              >
                                <Copy className="w-3 h-3 opacity-60" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {m.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-start">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted text-foreground rounded-xl px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about resumes..."
                    className="min-h-[44px] max-h-[120px] resize-none"
                    rows={1}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
