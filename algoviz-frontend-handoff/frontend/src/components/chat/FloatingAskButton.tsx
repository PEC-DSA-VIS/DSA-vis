import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingAskButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingAskButton: React.FC<FloatingAskButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-xl shadow-primary/25 border border-white/20 cursor-pointer group"
      aria-label="Open AI Mentor"
    >
      <div className="relative">
        <Bot className="w-4 h-4 text-white" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
      </div>
      <span className="tracking-wide">Ask AI</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
    </motion.button>
  );
};
