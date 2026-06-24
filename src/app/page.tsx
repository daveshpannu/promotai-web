import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-paper-cream text-ink-black font-sans overflow-x-hidden relative selection:bg-riso-blue selection:text-paper-cream">
      
      {/* Halftone Hero Background Map */}
      <div 
        className="absolute top-0 left-0 right-0 h-[85vh] z-0 border-b-4 border-ink-black shadow-brutal pointer-events-none"
        style={{
          backgroundImage: "url('/halftone_clouds.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />
      {/* Light overlay to ensure text readability */}
      <div className="absolute top-0 left-0 right-0 h-[85vh] z-0 bg-paper-cream/40 pointer-events-none mix-blend-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper-cream border-b-[3px] border-ink-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <div className="w-10 h-10 bg-riso-blue border-2 border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-paper-cream)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-ink-black mt-1">PromotAI</span>
          </div>

          {/* Center: Links */}
          <div className="hidden lg:flex items-center justify-center gap-10 w-2/4">
            <Link href="#features" className="text-base font-bold text-ink-muted hover:text-riso-blue hover:-translate-y-1 transition-transform">Features</Link>
            <Link href="#pricing" className="text-base font-bold text-ink-muted hover:text-riso-blue hover:-translate-y-1 transition-transform">Pricing</Link>
            <Link href="#docs" className="text-base font-bold text-ink-muted hover:text-riso-blue hover:-translate-y-1 transition-transform">Documentation</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-6 lg:w-1/4">
            <Link href="/login" className="hidden sm:block text-base font-bold text-ink-black hover:text-riso-blue transition-colors">
              Log in
            </Link>
            <Link href="/register" className="interactive-lift text-base font-bold bg-riso-blue text-paper-cream px-6 py-3 border-2 border-ink-black shadow-brutal hover:shadow-brutal-hover">
              Publish Ads
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 z-10 flex justify-center min-h-[85vh] items-center">
        <div className="relative max-w-5xl w-full text-center">
          
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-paper-cream border-[3px] border-ink-black shadow-brutal text-sm font-bold text-ink-black mb-10 transform -rotate-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full bg-riso-coral opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 bg-riso-coral border border-ink-black"></span>
            </span>
            Now live on ChatGPT, Claude, and Gemini
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 leading-[0.9] text-ink-black uppercase tracking-tighter drop-shadow-md">
            Your AI <span className="text-riso-blue">Thinks.</span><br />
            <span className="relative inline-block mt-4">
              <span className="absolute bottom-2 lg:bottom-4 left-[-5%] w-[110%] h-[40%] bg-riso-coral -z-10 border-2 border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-1"></span>
              You Earn.
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-ink-black mb-12 max-w-2xl mx-auto leading-relaxed font-medium bg-paper-cream/80 backdrop-blur-sm p-4 border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] transform rotate-1">
            Put your brand directly inside the most popular AI chatbots. Reach millions of developers, creators, and professionals while they work.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <Link href="/register" className="interactive-lift w-full sm:w-auto px-10 py-5 bg-riso-blue border-[3px] border-ink-black text-paper-cream font-display font-bold text-xl uppercase tracking-widest shadow-brutal hover:shadow-brutal-hover">
              Start Publishing Ads
            </Link>
            <Link href="#features" className="interactive-lift w-full sm:w-auto px-10 py-5 bg-paper-cream border-[3px] border-ink-black text-ink-black font-display font-bold text-xl uppercase tracking-widest shadow-brutal hover:shadow-brutal-hover">
              How it works
            </Link>
          </div>
        </div>
      </main>

      {/* Marquee Section */}
      <section className="py-10 border-b-[3px] border-ink-black bg-riso-coral overflow-hidden z-10 relative">
        <div className="flex whitespace-nowrap animate-marquee gap-16 items-center px-4 w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <div className="text-4xl font-display font-black text-ink-black uppercase tracking-widest flex items-center gap-4">
                <span className="text-paper-cream">★</span> ChatGPT
              </div>
              <div className="text-4xl font-display font-black text-ink-black uppercase tracking-widest flex items-center gap-4">
                <span className="text-paper-cream">★</span> Claude
              </div>
              <div className="text-4xl font-display font-black text-ink-black uppercase tracking-widest flex items-center gap-4">
                <span className="text-paper-cream">★</span> Gemini
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alternating Feature Blocks */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6 z-10 relative space-y-40">
        
        {/* Block 1: Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl lg:text-7xl font-display font-black mb-8 text-ink-black uppercase tracking-tighter leading-none">Live Ad Simulator</h2>
            <p className="text-xl text-ink-muted mb-8 leading-relaxed font-medium">
              Don't guess what your ad will look like. See exactly how your text and image assets will render inside ChatGPT, Claude, and Gemini before you hit publish. Adjust copy in real-time.
            </p>
            <ul className="space-y-4 mb-10 text-lg">
              <li className="flex items-center gap-4 text-ink-black font-bold">
                <div className="w-8 h-8 bg-riso-coral border-2 border-ink-black flex items-center justify-center">✓</div>
                Pixel-perfect previews
              </li>
              <li className="flex items-center gap-4 text-ink-black font-bold">
                <div className="w-8 h-8 bg-riso-blue border-2 border-ink-black flex items-center justify-center text-paper-cream">✓</div>
                Multi-model testing
              </li>
            </ul>
            <Link href="/register" className="inline-flex items-center gap-3 text-riso-blue font-black text-lg uppercase tracking-wider hover:underline underline-offset-8 decoration-4">
              Try the simulator →
            </Link>
          </div>
          <div className="bg-riso-blue border-4 border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative w-full h-[450px] flex flex-col justify-between overflow-hidden transform rotate-2">
            <div className="absolute inset-0 bg-halftone"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="w-3/4 h-16 bg-paper-cream border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"></div>
              
              <div className="w-full bg-paper-cream border-[3px] border-ink-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:rotate-1 transition-transform cursor-pointer">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-black text-riso-coral uppercase tracking-widest border-2 border-ink-black px-2 py-1">Sponsored</span>
                </div>
                <div className="h-32 bg-riso-blue border-2 border-ink-black mb-6 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full" style={{ backgroundImage: "url('/blueprint_ship.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
                </div>
                <div className="h-4 w-2/3 bg-ink-muted"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-paper-cream border-4 border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative w-full h-[450px] flex flex-col overflow-hidden transform -rotate-1">
            <div className="absolute inset-0 bg-halftone opacity-20"></div>
            
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div className="bg-paper-cream border-4 border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-2">Total Impressions</div>
                <div className="text-6xl font-display font-black text-ink-black">1.2M</div>
              </div>
              <div className="text-riso-blue font-black bg-paper-cream px-4 py-2 border-4 border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-6">+14% MoM</div>
            </div>
            
            <div className="flex-grow flex items-end gap-2 relative z-10 px-4 pb-4 border-b-4 border-ink-black">
              {[40, 70, 45, 90, 65, 80, 100, 60, 85, 50].map((h, i) => (
                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-riso-blue' : 'bg-riso-coral'} border-2 border-ink-black border-b-0 hover:-translate-y-2 transition-transform cursor-pointer`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl lg:text-7xl font-display font-black mb-8 text-ink-black uppercase tracking-tighter leading-none">Real-time Analytics</h2>
            <p className="text-xl text-ink-muted mb-8 leading-relaxed font-medium">
              Track views, clicks, and conversion rates with bold, tactile time-series charts. Understand exactly which models and times of day perform best for your audience.
            </p>
            <ul className="space-y-4 mb-10 text-lg">
              <li className="flex items-center gap-4 text-ink-black font-bold">
                <div className="w-8 h-8 bg-paper-dim border-2 border-ink-black flex items-center justify-center">✓</div>
                Model-specific breakdowns
              </li>
              <li className="flex items-center gap-4 text-ink-black font-bold">
                <div className="w-8 h-8 bg-paper-dim border-2 border-ink-black flex items-center justify-center">✓</div>
                Exportable CSV reports
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* Riso Waves Divider */}
      <div 
        className="w-full h-32 border-y-[4px] border-ink-black"
        style={{
          backgroundImage: "url('/riso_waves.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* CTA Section & Footer */}
      <footer className="pt-32 relative overflow-hidden z-10 bg-paper-cream">
        <div className="max-w-5xl mx-auto px-6 text-center mb-32">
          <h2 className="text-6xl lg:text-8xl font-display font-black mb-8 text-ink-black tracking-tighter uppercase leading-[0.9]">Ready to reach the AI generation?</h2>
          <p className="text-ink-black text-2xl mb-12 max-w-2xl mx-auto font-medium">Join hundreds of companies advertising directly inside the tools professionals use every day.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="interactive-lift px-10 py-5 bg-riso-blue text-paper-cream border-[3px] border-ink-black font-display font-black uppercase tracking-widest text-xl shadow-brutal hover:shadow-brutal-hover">
              Start Building Campaigns
            </Link>
          </div>
        </div>

        <div className="border-t-[4px] border-ink-black bg-paper-dim">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-riso-blue border-2 border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-paper-cream)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                  </div>
                  <span className="font-display font-black text-4xl tracking-tight text-ink-black">PromotAI</span>
                </div>
                <p className="text-ink-muted font-medium text-lg max-w-md">The first native advertising platform for AI chatbots. Your AI thinks, you earn.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-ink-black mb-6 uppercase tracking-widest text-sm border-b-2 border-ink-black pb-2 inline-block">Product</h4>
                <ul className="space-y-4 font-bold text-ink-muted">
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">Documentation</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-ink-black mb-6 uppercase tracking-widest text-sm border-b-2 border-ink-black pb-2 inline-block">Company</h4>
                <ul className="space-y-4 font-bold text-ink-muted">
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-riso-blue transition-colors">Careers</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center text-ink-black font-bold border-t-[3px] border-ink-black pt-8">
              <p>© 2026 PromotAI Inc. All rights reserved.</p>
              <div className="flex gap-8 mt-4 md:mt-0">
                <Link href="#" className="hover:text-riso-blue transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-riso-blue transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
