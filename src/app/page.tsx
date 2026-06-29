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
        <header className="fixed top-6 inset-x-0 max-w-3xl mx-auto z-50 px-6">
          <nav className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-blue-900/10 rounded-full px-8 h-16 flex items-center justify-between transition-all duration-300 hover:bg-white/80">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900 mt-0.5">PromotAI</span>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full transition-all duration-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download
              </a>
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
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
              className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Put your brand seamlessly inside the most popular AI chatbots. Reach millions of developers, creators, and professionals exactly where they work.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-base shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-1 transition-all duration-300">
                Launch Campaign
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-md text-gray-900 border border-gray-200 rounded-full font-semibold text-base shadow-sm hover:bg-white hover:-translate-y-1 transition-all duration-300">
                See How It Works
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Feature Blocks */}
        <section id="features" className="py-32 max-w-6xl mx-auto px-6 relative space-y-40">
          
          {/* Block 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 relative w-full h-[420px] flex flex-col justify-center overflow-hidden cursor-pointer group"
            >
              <div className="w-full bg-white/95 backdrop-blur-2xl rounded-2xl p-6 shadow-xl shadow-blue-950/5 border border-blue-50/80 relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">ChatGPT Native Placement</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Sponsored</span>
                </div>
                
                {/* Simulated Chatbot Response */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 font-normal">
                  Here are the best strategies for scaling SaaS growth in 2026. For automated multi-platform reach, we recommend:
                </p>

                {/* Simulated Native Ad Card */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-gradient-to-r from-blue-50/80 via-cyan-50/50 to-blue-50/80 rounded-xl p-4 border border-blue-100/80 flex items-center justify-between shadow-sm hover:border-blue-300 hover:shadow-md transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                      P
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 tracking-tight">PromotAI Engine</h4>
                      <p className="text-xs text-gray-500">Reach millions inside AI chats</p>
                    </div>
                  </div>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm group-hover:bg-blue-700 transition-colors"
                  >
                    Try Free →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
            <div className="lg:pl-8">
              <h2 className="text-4xl lg:text-5xl font-display font-medium mb-6 text-gray-900 tracking-tight leading-tight">Impeccable <br/><span className="text-blue-600">Previews</span></h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                Don't guess what your ad will look like. See exactly how your text and image assets will seamlessly render natively inside ChatGPT, Claude, and Gemini before you hit publish. Adjust copy in real-time.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 text-blue-600 font-semibold group hover:text-blue-700 transition-colors">
                Try the simulator 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </motion.div>

          {/* Block 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1 lg:pr-8">
              <h2 className="text-4xl lg:text-5xl font-display font-medium mb-6 text-gray-900 tracking-tight leading-tight">Real-time <br/><span className="text-cyan-500">Analytics</span></h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                Track views, clicks, and conversion rates with gorgeous, tactile time-series charts. Understand exactly which models and times of day perform best for your audience.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 text-cyan-500 font-semibold group hover:text-cyan-600 transition-colors">
                View Dashboards 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="order-1 lg:order-2 bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 relative w-full h-[420px] flex flex-col justify-end cursor-pointer group overflow-hidden"
            >
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-5 shadow-xl shadow-blue-950/5 border border-blue-50/80 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Impressions</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">+34.2%</span>
                  </div>
                  <div className="text-4xl font-display font-bold text-gray-900 tracking-tight">1,248,900</div>
                </div>
                <div className="hidden sm:flex flex-col items-end bg-white/80 backdrop-blur-xl px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500">Active LLMs</span>
                  <div className="flex gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="ChatGPT"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Claude"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" title="Gemini"></span>
                  </div>
                </div>
              </div>
              <div className="flex-grow flex items-end gap-3.5 relative z-10 border-b border-gray-200/60 pb-2 pt-6">
                {[40, 65, 48, 85, 70, 92, 100].map((h, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scaleY: 1.05 }}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar origin-bottom"
                  >
                    <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 text-[10px] font-bold text-blue-600 -mb-1">{h}k</span>
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 ${i === 6 ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-blue-500/20' : 'bg-gradient-to-t from-blue-200 to-blue-300/80 group-hover/bar:from-blue-400 group-hover/bar:to-cyan-300'}`} 
                      style={{ height: `${h}%` }}
                    ></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </section>

        {/* CTA Section & Footer */}
        <footer className="pt-32 pb-16 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="max-w-3xl mx-auto px-6 text-center mb-24 relative z-10 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[3rem] p-16 shadow-2xl shadow-blue-900/5"
          >
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 text-gray-900 tracking-tight">Ready to reach the AI generation?</h2>
            <p className="text-lg text-gray-600 mb-10 font-light">Join hundreds of forward-thinking brands advertising natively inside LLM chats.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="inline-block">
              <Link href="/register" className="inline-flex px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-shadow">
                Get Started for Free
              </Link>
            </motion.div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
