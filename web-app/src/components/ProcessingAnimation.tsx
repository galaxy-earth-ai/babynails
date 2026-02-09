"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const ProcessingAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-md overflow-hidden rounded-2xl">
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-1 bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.8)] z-10"
      />
      <div className="text-center text-white space-y-4 relative z-20">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-bold tracking-[0.3em] uppercase"
        >
          AI Mapping Nail Beds...
        </motion.div>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-pink-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
