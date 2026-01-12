"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, X } from "lucide-react";

export interface Character {
  emoji: string;
  name: string;
  online?: boolean;
  backgroundColor?: string;
  gradientColors?: string;
}

interface MessageDockProps {
  characters: Character[];
  onMessageSend?: (message: string, character: Character, index: number) => void;
  onCharacterSelect?: (character: Character) => void;
  onDockToggle?: (isExpanded: boolean) => void;
  placeholder?: string | ((name: string) => string);
  theme?: "light" | "dark" | "auto";
  enableAnimations?: boolean;
  closeOnSend?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const MessageDock: React.FC<MessageDockProps> = ({
  characters,
  onMessageSend,
  onCharacterSelect,
  onDockToggle,
  placeholder = (name) => `Send a message to ${name}...`,
  theme = "auto",
  enableAnimations = true,
  closeOnSend = true,
  autoFocus = true,
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark" || (theme === "auto" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (isExpanded && autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
    onDockToggle?.(isExpanded);
  }, [isExpanded, autoFocus, onDockToggle]);

  const handleCharacterClick = (index: number) => {
    if (selectedIndex === index && isExpanded) {
      setIsExpanded(false);
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
      setIsExpanded(true);
      onCharacterSelect?.(characters[index]);
    }
  };

  const handleSend = () => {
    if (message.trim() && selectedIndex !== null) {
      onMessageSend?.(message, characters[selectedIndex], selectedIndex);
      setMessage("");
      if (closeOnSend) {
        setIsExpanded(false);
        setSelectedIndex(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
      setSelectedIndex(null);
    }
  };

  const getPlaceholderText = () => {
    if (selectedIndex === null) return "";
    const name = characters[selectedIndex].name;
    return typeof placeholder === "function" ? placeholder(name) : placeholder;
  };

  const animationProps = enableAnimations
    ? {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.9 },
        transition: { type: "spring" as const, stiffness: 300, damping: 25 },
      }
    : {};

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <AnimatePresence>
        {isExpanded && selectedIndex !== null && (
          <motion.div
            {...animationProps}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 shadow-lg border",
              isDark
                ? "bg-card border-border"
                : "bg-card border-border"
            )}
          >
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              className={cn(
                "w-64 bg-transparent outline-none text-sm",
                isDark ? "text-foreground placeholder:text-muted-foreground" : "text-foreground placeholder:text-muted-foreground"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={cn(
                "p-2 rounded-full transition-all",
                message.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                setSelectedIndex(null);
              }}
              className="p-2 rounded-full hover:bg-muted transition-all"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout={enableAnimations}
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-2 shadow-lg border",
          isDark
            ? "bg-card border-border"
            : "bg-card border-border"
        )}
      >
        {characters.map((char, index) => (
          <motion.button
            key={index}
            whileHover={enableAnimations ? { scale: 1.15 } : {}}
            whileTap={enableAnimations ? { scale: 0.95 } : {}}
            onClick={() => handleCharacterClick(index)}
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-full text-2xl transition-all",
              char.backgroundColor || "bg-muted",
              selectedIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            style={
              char.gradientColors
                ? {
                    background: `linear-gradient(135deg, ${char.gradientColors})`,
                  }
                : {}
            }
          >
            {char.emoji}
            {char.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export { MessageDock };
