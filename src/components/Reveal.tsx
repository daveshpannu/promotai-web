'use client';

import { motion } from 'motion/react';
import React from 'react';

export function RevealStagger({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.23, 1, 0.32, 1], // Emil Kowalski ease-out-strong
      }}
    >
      {children}
    </motion.div>
  );
}
