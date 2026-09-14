'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import HeaderAuthMenu from '@/components/HeaderAuthMenu';

export default function MarketingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Epic Parallax transform physics
  const cloud1Y = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const cloud1X = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  const cloud2Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const cloud2X = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-[#fdfbf7] font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 relative text-gray-800">
      
      {/* --- EPIC PARALLAX PAPER CUT LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Light Halftone Sky Texture */}
        <div className="absolute inset-0 bg-halftone-sky"></div>

        {/* Deep Background Clouds */}
        <motion.div 
          style={{ y: cloud2Y, x: cloud2X }}
          className="absolute top-[5%] left-[5%] w-[500px] h-[350px] opacity-30 mix-blend-multiply"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-contain filter grayscale opacity-60" />
        </motion.div>

        {/* Foreground Clouds */}
        <motion.div 
          style={{ y: cloud1Y, x: cloud1X }}
          className="absolute top-[25%] right-[5%] w-[700px] h-[450px] opacity-60 mix-blend-multiply"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-contain" />
        </motion.div>
      </div>

      {/* --- FOREGROUND UI --- */}
      <div className="relative z-10">
        {/* Floating Rounded Rectangle Navigation */}
        <header className="fixed top-6 inset-x-0 max-w-4xl mx-auto z-50 px-4 sm:px-6">
          <nav className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-blue-900/10 rounded-full px-5 sm:px-8 h-16 flex items-center justify-between transition-all duration-300 hover:bg-white/90">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900 mt-0.5">PromotAI</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <a 
                href="/downloads/PromotAI.exe" 
                download="PromotAI.exe"
                className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download App
              </a>

              {/* Login Option Dropdown with 2 Auth Methods: Username/Password & Google */}
              <HeaderAuthMenu />

              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 sm:px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Start Publishing
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 flex justify-center min-h-screen items-center">
          <div className="max-w-4xl w-full text-center relative z-20">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-sm text-xs font-semibold text-gray-600 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now live on ChatGPT, Claude, and Gemini
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-medium mb-6 leading-[1.05] text-gray-900 tracking-tight"
            >
              Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 font-semibold italic">Thinks.</span><br />
              You Earn.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              The world's first high-yield interstitial advertising network designed exclusively for desktop AI generation cycles.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-9 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                <span>Launch Campaign</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <a 
                href="/downloads/PromotAI.exe" 
                download="PromotAI.exe"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/80 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download Client
              </a>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
