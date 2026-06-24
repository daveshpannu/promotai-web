'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function AdminFloatingAssets() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll(); // Use global scroll for the whole window

  const planeY = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const planeX = useTransform(scrollYProgress, [0, 1], [0, 600]);
  
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        style={{ y: cloudY }}
        className="absolute top-[20%] left-[-10%] w-[500px] mix-blend-multiply opacity-60 filter grayscale"
      >
        <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-auto" />
      </motion.div>

      <motion.div 
        style={{ y: planeY, x: planeX }}
        className="absolute top-[-20%] left-[-10%] w-[300px] mix-blend-multiply opacity-80 transform rotate-[135deg]"
      >
        <img src="/paper_plane.png" alt="Plane" className="w-full h-auto" />
      </motion.div>
    </div>
  );
}
