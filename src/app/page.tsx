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
  
  const planeY = useTransform(scrollYProgress, [0, 1], [1000, -2000]);
  const planeX = useTransform(scrollYProgress, [0, 1], [-1000, 2000]);

  const boatY = useTransform(scrollYProgress, [0, 1], [400, -800]);
  const boatX = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  const hillY = useTransform(scrollYProgress, [0, 1], [300, -200]);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-[#fdfbf7] font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 relative text-gray-800">
      
      {/* --- EPIC PARALLAX PAPER CUT LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
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

        {/* The Airplane (Massive & Fast) */}
        <motion.div 
          style={{ y: planeY, x: planeX }}
          className="absolute top-[80%] left-[-20%] w-[800px] h-[800px] mix-blend-multiply transform rotate-[60deg] opacity-90 drop-shadow-2xl"
        >
          <img src="/paper_plane.png" alt="Airplane" className="w-full h-full object-contain" />
        </motion.div>

        {/* The Boat (Large) */}
        <motion.div 
          style={{ y: boatY, x: boatX }}
          className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] mix-blend-multiply opacity-90 drop-shadow-xl"
        >
          <img src="/paper_boat.png" alt="Boat" className="w-full h-full object-contain" />
        </motion.div>

        {/* The Massive Hill Anchor */}
        <motion.div 
          style={{ y: hillY }}
          className="absolute bottom-[-30vh] left-[-10vw] w-[120vw] h-[100vh] opacity-100 mix-blend-multiply drop-shadow-2xl"
        >
          <img src="/paper_tree_hill.png" alt="Hill" className="w-full h-full object-cover object-top" />
        </motion.div>
      </div>

      {/* --- FOREGROUND UI --- */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-gray-900 mt-1">PromotAI</span>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-10">
              <Link href="#features" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center justify-end gap-6">
              <Link href="/login" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-bold bg-gray-900 text-white px-6 py-2.5 rounded-full shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all duration-300">
                Start Publishing
              </Link>
            </div>
          </div>
        </nav>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 relative w-full h-[400px] flex flex-col justify-center overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 relative z-10">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Live Preview</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-28 bg-gradient-to-tr from-blue-50 to-blue-100/50 rounded-xl mb-6"></div>
                <div className="h-3 w-3/4 bg-gray-100 rounded-full mb-3"></div>
                <div className="h-3 w-1/2 bg-gray-100 rounded-full"></div>
              </div>
            </div>
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
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
            <div className="order-1 lg:order-2 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 relative w-full h-[400px] flex flex-col justify-end transition-transform duration-500 hover:scale-[1.02]">
              <div className="flex justify-between items-end mb-8 relative z-10">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Impressions</div>
                  <div className="text-4xl font-display font-medium text-gray-900 tracking-tight">1.2M</div>
                </div>
              </div>
              <div className="flex-grow flex items-end gap-3 relative z-10 border-b border-gray-200/50 pb-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-md ${i % 2 === 0 ? 'bg-blue-400' : 'bg-cyan-300'} opacity-80 hover:opacity-100 transition-opacity`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* CTA Section & Footer */}
        <footer className="pt-32 pb-16 relative">
          <div className="max-w-3xl mx-auto px-6 text-center mb-24 relative z-10 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[3rem] p-16 shadow-2xl shadow-blue-900/5">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 text-gray-900 tracking-tight">Ready to reach the AI generation?</h2>
            <p className="text-lg text-gray-600 mb-10 font-light">Join hundreds of forward-thinking brands advertising natively inside LLM chats.</p>
            <Link href="/register" className="inline-flex px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
              Get Started for Free
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
