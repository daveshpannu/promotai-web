'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';

export default function MarketingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Epic Parallax cloud physics
  const cloud1Y = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const cloud1X = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const cloud2Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const cloud2X = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Diabrowser Bottom Stretching Aurora Colors Physics
  // As user scrolls past halfway towards the bottom, the colors stretch up and grow intense
  const bottomAuroraScaleY = useTransform(scrollYProgress, [0.4, 1], [0.1, 2.5]);
  const bottomAuroraOpacity = useTransform(scrollYProgress, [0.3, 1], [0.1, 1]);
  const bottomAuroraY = useTransform(scrollYProgress, [0.4, 1], [300, -50]);

  return (
    <div ref={containerRef} className="min-h-[220vh] bg-[#020204] font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-white relative text-white">
      
      {/* --- BACKGROUND ATMOSPHERE & CLOUDS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Dark Halftone Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Deep Dark Clouds with Subtle Glow */}
        <motion.div 
          style={{ y: cloud2Y, x: cloud2X }}
          className="absolute top-[10%] left-[5%] w-[500px] h-[350px] opacity-15 mix-blend-screen invert"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-contain filter blur-[1px]" />
        </motion.div>

        <motion.div 
          style={{ y: cloud1Y, x: cloud1X }}
          className="absolute top-[30%] right-[5%] w-[700px] h-[450px] opacity-20 mix-blend-screen invert"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-contain filter blur-[1px]" />
        </motion.div>
      </div>

      {/* --- DIABROWSER BOTTOM STRETCHING AURORA ANIMATION --- */}
      <motion.div 
        style={{ scaleY: bottomAuroraScaleY, opacity: bottomAuroraOpacity, y: bottomAuroraY }}
        className="fixed inset-x-0 bottom-0 pointer-events-none z-0 flex justify-center items-end h-[600px] origin-bottom overflow-hidden"
      >
        {/* Colorful Stretching Beams from bottom */}
        <div className="absolute w-[900px] h-[450px] bg-gradient-to-t from-blue-600 via-cyan-400 to-transparent rounded-full blur-[130px] opacity-80 mix-blend-screen -bottom-40"></div>
        <div className="absolute w-[700px] h-[400px] bg-gradient-to-t from-purple-600 via-pink-500 to-transparent rounded-full blur-[110px] opacity-70 mix-blend-screen -bottom-32 -left-20"></div>
        <div className="absolute w-[700px] h-[400px] bg-gradient-to-t from-emerald-500 via-teal-300 to-transparent rounded-full blur-[110px] opacity-60 mix-blend-screen -bottom-32 -right-20"></div>
        <div className="absolute w-[500px] h-[300px] bg-gradient-to-t from-amber-500 via-rose-500 to-transparent rounded-full blur-[90px] opacity-50 mix-blend-screen -bottom-20"></div>
      </motion.div>

      {/* --- FOREGROUND UI --- */}
      <div className="relative z-10">
        {/* Diabrowser Frosted Pill Navigation */}
        <header className="fixed top-6 inset-x-0 max-w-3xl mx-auto z-50 px-6">
          <nav className="bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/50 rounded-full px-8 h-16 flex items-center justify-between transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white mt-0.5">PromotAI</span>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 text-white/90 hover:bg-white/20 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download
              </a>
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 text-sm font-bold bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-full shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                Start Publishing
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative pt-44 pb-24 lg:pt-52 lg:pb-36 px-6 flex justify-center min-h-screen items-center">
          <div className="max-w-4xl w-full text-center relative z-20">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.05] backdrop-blur-md border border-white/15 rounded-full shadow-sm text-xs font-semibold text-zinc-300 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Now live on ChatGPT, Claude, and Gemini
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-medium mb-6 leading-[1.05] text-white tracking-tight"
            >
              Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 font-semibold italic">Thinks.</span><br />
              You Earn.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg lg:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Put your brand seamlessly inside the most popular AI chatbots. Reach millions of developers, creators, and professionals exactly where they work.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-base shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                Launch Campaign
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/[0.06] backdrop-blur-md text-white border border-white/15 rounded-full font-semibold text-base shadow-sm hover:bg-white/10 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                See How It Works
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Feature Blocks */}
        <section id="features" className="py-32 max-w-6xl mx-auto px-6 relative space-y-40">
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-black/80 relative w-full h-[420px] flex flex-col justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/20 cursor-pointer group">
              <div className="w-full bg-[#0d0d12]/90 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/10 relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">ChatGPT Native Placement</span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/10">Sponsored</span>
                </div>
                
                {/* Simulated Chatbot Response */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-4 font-normal">
                  Here are the best strategies for scaling SaaS growth in 2026. For automated multi-platform reach, we recommend:
                </p>

                {/* Simulated Native Ad Card */}
                <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-blue-950/60 rounded-xl p-4 border border-blue-500/30 flex items-center justify-between shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
                      P
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">PromotAI Engine</h4>
                      <p className="text-xs text-zinc-400">Reach millions inside AI chats</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 bg-cyan-500 text-black rounded-lg text-xs font-bold shadow-sm group-hover:bg-cyan-400 transition-colors cursor-pointer">
                    Try Free →
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <h2 className="text-4xl lg:text-5xl font-display font-medium mb-6 text-white tracking-tight leading-tight">Impeccable <br/><span className="text-cyan-400">Previews</span></h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-light">
                Don't guess what your ad will look like. See exactly how your text and image assets will seamlessly render natively inside ChatGPT, Claude, and Gemini before you hit publish. Adjust copy in real-time.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 text-cyan-400 font-semibold group hover:text-cyan-300 transition-colors cursor-pointer">
                Try the simulator 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 lg:pr-8">
              <h2 className="text-4xl lg:text-5xl font-display font-medium mb-6 text-white tracking-tight leading-tight">Real-time <br/><span className="text-blue-400">Analytics</span></h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-light">
                Track views, clicks, and conversion rates with gorgeous, tactile time-series charts. Understand exactly which models and times of day perform best for your audience.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 text-blue-400 font-semibold group hover:text-blue-300 transition-colors cursor-pointer">
                View Dashboards 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            <div className="order-1 lg:order-2 bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-black/80 relative w-full h-[420px] flex flex-col justify-end transition-all duration-500 hover:scale-[1.02] hover:border-white/20 cursor-pointer group overflow-hidden">
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div className="bg-[#0d0d12]/90 backdrop-blur-2xl rounded-2xl p-5 shadow-xl border border-white/10 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Impressions</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">+34.2%</span>
                  </div>
                  <div className="text-4xl font-display font-bold text-white tracking-tight">1,248,900</div>
                </div>
                <div className="hidden sm:flex flex-col items-end bg-white/[0.06] backdrop-blur-xl px-4 py-3 rounded-xl border border-white/10 shadow-sm">
                  <span className="text-[11px] font-semibold text-zinc-400">Active LLMs</span>
                  <div className="flex gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" title="ChatGPT"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Claude"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" title="Gemini"></span>
                  </div>
                </div>
              </div>
              <div className="flex-grow flex items-end gap-3.5 relative z-10 border-b border-white/10 pb-2 pt-6">
                {[40, 65, 48, 85, 70, 92, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                    <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 text-[10px] font-bold text-cyan-400 -mb-1">{h}k</span>
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 ${i === 6 ? 'bg-gradient-to-t from-blue-600 via-cyan-400 to-white shadow-md shadow-cyan-500/30' : 'bg-gradient-to-t from-white/10 to-white/30 group-hover/bar:from-blue-500 group-hover/bar:to-cyan-400'}`} 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* CTA Section & Footer */}
        <footer className="pt-40 pb-24 relative">
          <div className="max-w-3xl mx-auto px-6 text-center mb-24 relative z-10 bg-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-[3rem] p-16 shadow-2xl shadow-black/80 transition-all duration-500 hover:border-white/25">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 text-white tracking-tight">Ready to reach the AI generation?</h2>
            <p className="text-lg text-zinc-400 mb-10 font-light">Join hundreds of forward-thinking brands advertising natively inside LLM chats.</p>
            <Link href="/register" className="inline-flex px-10 py-4 bg-white text-black rounded-full font-bold text-lg shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              Get Started for Free
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
