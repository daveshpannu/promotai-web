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
    <div ref={containerRef} className="min-h-[200vh] bg-paper-cream font-sans overflow-x-hidden selection:bg-riso-blue selection:text-paper-cream relative">
      
      {/* --- EPIC PARALLAX PAPER CUT LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Deep Background Clouds (Massive) */}
        <motion.div 
          style={{ y: cloud2Y, x: cloud2X }}
          className="absolute top-[-10%] left-[-20%] w-[120vw] h-[100vh] opacity-30 mix-blend-multiply"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-cover filter grayscale opacity-60" />
        </motion.div>

        {/* Foreground Clouds (Massive) */}
        <motion.div 
          style={{ y: cloud1Y, x: cloud1X }}
          className="absolute top-[20%] right-[-30%] w-[150vw] h-[120vh] opacity-60 mix-blend-multiply"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-full object-cover" />
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-paper-cream/80 backdrop-blur-md border-b-[3px] border-ink-black transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-riso-blue border-2 border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-paper-cream)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <span className="font-display font-black text-3xl tracking-tight text-ink-black mt-1">PromotAI</span>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-10">
              <Link href="#features" className="text-base font-bold text-ink-muted hover:text-riso-blue hover:-translate-y-1 transition-transform">Features</Link>
              <Link href="#pricing" className="text-base font-bold text-ink-muted hover:text-riso-blue hover:-translate-y-1 transition-transform">Pricing</Link>
            </div>

            <div className="flex items-center justify-end gap-6">
              <Link href="/login" className="hidden sm:block text-base font-bold text-ink-black hover:text-riso-blue transition-colors">
                Log in
              </Link>
              <Link href="/register" className="interactive-lift text-base font-bold bg-riso-blue text-paper-cream px-6 py-3 border-2 border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                Publish Ads
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 flex justify-center min-h-screen items-center">
          <div className="max-w-5xl w-full text-center relative z-20">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-paper-cream border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-sm font-bold text-ink-black mb-10 transform -rotate-1"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full bg-riso-coral opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 bg-riso-coral border border-ink-black"></span>
              </span>
              Now live on ChatGPT, Claude, and Gemini
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 leading-[0.9] text-ink-black uppercase tracking-tighter drop-shadow-sm"
            >
              Your AI <span className="text-riso-blue">Thinks.</span><br />
              <span className="relative inline-block mt-4">
                <span className="absolute bottom-2 lg:bottom-4 left-[-5%] w-[110%] h-[40%] bg-riso-coral -z-10 border-2 border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-1"></span>
                You Earn.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-ink-black mb-12 max-w-2xl mx-auto leading-relaxed font-medium bg-white/90 backdrop-blur-sm p-6 border-[3px] border-ink-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] transform rotate-1"
            >
              Put your brand directly inside the most popular AI chatbots. Reach millions of developers, creators, and professionals while they work.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
            >
              <Link href="/register" className="interactive-lift w-full sm:w-auto px-10 py-5 bg-riso-blue border-[3px] border-ink-black text-paper-cream font-display font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                Start Publishing
              </Link>
              <Link href="#features" className="interactive-lift w-full sm:w-auto px-10 py-5 bg-paper-cream border-[3px] border-ink-black text-ink-black font-display font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                Discover How
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Feature Blocks */}
        <section id="features" className="py-32 max-w-7xl mx-auto px-6 relative space-y-40">
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-paper-cream border-[4px] border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative w-full h-[450px] flex flex-col justify-center overflow-hidden transform rotate-2">
              <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
              <div className="w-full bg-white border-[3px] border-ink-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transform -rotate-1 relative z-10">
                <div className="flex justify-between items-center mb-6 border-b-2 border-ink-black pb-2">
                  <span className="text-sm font-black text-riso-coral uppercase tracking-widest">Sponsored Preview</span>
                </div>
                <div className="h-32 bg-riso-blue border-2 border-ink-black mb-6"></div>
                <div className="h-4 w-2/3 bg-ink-muted mb-2"></div>
                <div className="h-4 w-1/2 bg-ink-muted"></div>
              </div>
            </div>
            <div>
              <h2 className="text-5xl lg:text-7xl font-display font-black mb-8 text-ink-black uppercase tracking-tighter leading-none bg-white/80 p-4 border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] inline-block transform -rotate-1">Impeccable <br/> Previews</h2>
              <p className="text-xl text-ink-black mb-8 leading-relaxed font-bold bg-paper-cream/90 p-6 border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-1">
                Don't guess what your ad will look like. See exactly how your text and image assets will render inside ChatGPT, Claude, and Gemini before you hit publish. Adjust copy in real-time.
              </p>
              <Link href="/register" className="inline-flex items-center gap-3 px-6 py-3 bg-riso-coral text-ink-black border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-black text-lg uppercase tracking-wider interactive-lift">
                Try the simulator →
              </Link>
            </div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-5xl lg:text-7xl font-display font-black mb-8 text-ink-black uppercase tracking-tighter leading-none bg-white/80 p-4 border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] inline-block transform rotate-1">Real-time <br/> Analytics</h2>
              <p className="text-xl text-ink-black mb-8 leading-relaxed font-bold bg-paper-cream/90 p-6 border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-1">
                Track views, clicks, and conversion rates with bold, tactile time-series charts. Understand exactly which models and times of day perform best for your audience.
              </p>
              <Link href="/register" className="inline-flex items-center gap-3 px-6 py-3 bg-riso-blue text-paper-cream border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-black text-lg uppercase tracking-wider interactive-lift">
                View Dashboards →
              </Link>
            </div>
            <div className="order-1 lg:order-2 bg-white border-[4px] border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative w-full h-[450px] flex flex-col justify-end transform -rotate-1 overflow-hidden">
              <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
              <div className="flex justify-between items-end mb-8 relative z-10">
                <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-2">
                  <div className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-1">Total Impressions</div>
                  <div className="text-5xl font-display font-black text-ink-black">1.2M</div>
                </div>
              </div>
              <div className="flex-grow flex items-end gap-2 relative z-10 border-b-[3px] border-ink-black pb-2 px-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-riso-blue' : 'bg-riso-coral'} border-2 border-ink-black border-b-0`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* CTA Section & Footer */}
        <footer className="pt-32 pb-16 relative bg-paper-dim border-t-[4px] border-ink-black mt-20">
          <div className="max-w-4xl mx-auto px-6 text-center mb-24 relative z-10">
            <h2 className="text-6xl lg:text-8xl font-display font-black mb-8 text-ink-black tracking-tighter uppercase leading-[0.9]">Ready to reach the AI generation?</h2>
            <div className="flex justify-center mt-12">
              <Link href="/register" className="interactive-lift px-10 py-5 bg-ink-black text-paper-cream border-[3px] border-ink-black font-display font-black uppercase tracking-widest text-xl shadow-[8px_8px_0_0_rgba(255,138,102,1)] hover:shadow-[10px_10px_0_0_rgba(255,138,102,1)]">
                Launch Campaign
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
