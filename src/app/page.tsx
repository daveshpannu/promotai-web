import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#bbf7d0] via-[#86efac] to-[#5eead4] text-[#1e293b] font-sans overflow-x-hidden relative selection:bg-[#c4f051] selection:text-[#1e293b]">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-white/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 lg:w-1/4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shadow-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">PromotAI</span>
          </div>

          {/* Center: Links */}
          <div className="hidden lg:flex items-center justify-center gap-8 w-2/4">
            <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#docs" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Documentation</Link>
            <Link href="#blog" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Blog</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-5 lg:w-1/4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-md">
              Publish Ads
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 z-10 flex justify-center">
        <div className="relative max-w-4xl w-full">
          {/* Reference Image Mesh Gradients (Behind the box) */}
          <div className="absolute top-[20%] -right-[5%] w-[350px] h-[350px] bg-[#c4f051] rounded-full filter blur-[100px] opacity-90 pointer-events-none z-0" />
          <div className="absolute -bottom-[10%] -right-[2%] w-[300px] h-[300px] bg-blue-600 rounded-full filter blur-[90px] opacity-80 pointer-events-none z-0" />

          {/* Frosted Glass Container */}
          <div className="relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[40px] p-10 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] text-center z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-sm font-semibold text-slate-700 mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
            </span>
            Now live on ChatGPT, Claude, and Gemini
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-800">
            Your AI Thinks.<br />
            <span className="relative z-10">
              <span className="absolute bottom-1 lg:bottom-3 left-0 w-full h-[30%] lg:h-[40%] bg-[#c4f051] -z-10 rounded-sm transform -rotate-1"></span>
              You Earn.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Put your brand directly inside the most popular AI chatbots. Reach millions of developers, creators, and professionals while they work.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#1e293b] rounded-2xl font-semibold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all">
              Start Publishing Ads
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/60 border border-white/80 rounded-2xl font-semibold text-slate-800 hover:bg-white hover:-translate-y-1 transition-all shadow-sm">
              How it works
            </Link>
          </div>
        </div>
        </div>
      </main>

      {/* Marquee Section */}
      <section className="py-12 border-y border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden z-10 relative">
        <p className="text-center text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest">Supported Platforms</p>
        <div className="flex whitespace-nowrap animate-marquee gap-16 items-center px-4 w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-400 hover:text-slate-800 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.36l-4.774 2.782a.77.77 0 0 0-.393.682v5.57l4.774-2.782a.77.77 0 0 0 .393-.681v-5.571a.07.07 0 0 1 .033-.062l.107-.061l-.14-.08z" /></svg>
                ChatGPT
              </div>
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-400 hover:text-slate-800 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z" /></svg>
                Claude
              </div>
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-400 hover:text-slate-800 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4" /><circle cx="4" cy="20" r="2" /></svg>
                Gemini
              </div>
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-400 hover:text-slate-800 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0M1.931 5.47A11.94 11.94 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257q.309.015.621.016c6.627 0 12-5.373 12-12c0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728a4.364 4.364 0 0 1 0 8.728" /></svg>
                Any Browser
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
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-800 tracking-tight">Live Ad Simulator</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              Don't guess what your ad will look like. See exactly how your text and image assets will render inside ChatGPT, Claude, and Gemini before you hit publish. Adjust copy in real-time.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Pixel-perfect previews
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Multi-model testing
              </li>
            </ul>
            <Link href="/register" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
              Try the simulator <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 lg:p-10 shadow-2xl relative w-full h-[400px] flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 rounded-full blur-[50px] group-hover:bg-cyan-400/30 transition-all"></div>
            {/* Chat bubbles UI */}
            <div className="space-y-4 relative z-10">
              <div className="w-3/4 h-12 bg-white/60 border border-white rounded-2xl rounded-tl-sm animate-pulse shadow-sm"></div>
              <div className="w-full bg-gradient-to-br from-white to-white/40 border border-white p-5 rounded-2xl shadow-md transform hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Sponsored</span>
                  <span className="w-4 h-4 rounded-full bg-slate-200"></span>
                </div>
                <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-4 border border-white"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="w-full h-14 bg-white/80 rounded-full border border-white shadow-sm flex items-center px-6 relative z-10">
              <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Block 2: Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 lg:p-10 shadow-2xl relative w-full h-[400px] flex flex-col group overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-[50px] group-hover:bg-emerald-400/30 transition-all"></div>
            <div className="flex justify-between items-end mb-10 relative z-10">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Impressions</div>
                <div className="text-5xl font-extrabold text-slate-800">1.2M</div>
              </div>
              <div className="text-green-600 font-bold bg-white px-4 py-2 rounded-full text-sm border border-white shadow-sm">+14% MoM</div>
            </div>
            <div className="flex-grow flex items-end gap-3 lg:gap-4 opacity-90 relative z-10">
              {[40, 70, 45, 90, 65, 80, 100, 60, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-400 to-emerald-400 rounded-t-xl transition-all hover:opacity-80 shadow-inner" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-800 tracking-tight">Real-time Analytics</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              Track views, clicks, and conversion rates with beautiful, responsive time-series charts. Understand exactly which models and times of day perform best for your audience.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Model-specific breakdowns
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Exportable CSV reports
              </li>
            </ul>
          </div>
        </div>

        {/* Block 3: Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-800 tracking-tight">Smart Controls</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              Take full control of your spending and exposure. Assign priority levels to ensure your most important campaigns win the auction, and set frequency caps to protect user experience.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Dynamic Weighting
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Automated Frequency Capping
              </li>
            </ul>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 lg:p-10 shadow-2xl relative w-full h-[400px] flex flex-col justify-center group overflow-hidden">
            <div className="absolute top-10 right-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-[50px] group-hover:bg-indigo-400/30 transition-all"></div>
            <div className="space-y-6 relative z-10">
              <div className="bg-white/80 border border-white p-6 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-slate-800 text-lg">Frequency Cap</div>
                  <div className="text-slate-500">Max views per user/day</div>
                </div>
                <div className="bg-[#1e293b] px-6 py-3 rounded-xl font-bold text-white shadow-inner">3</div>
              </div>
              <div className="bg-white/80 border border-white p-6 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-slate-800 text-lg">Dynamic Weighting</div>
                  <div className="text-slate-500">Auction priority level</div>
                </div>
                <div className="w-14 h-8 bg-[#10b981] rounded-full relative shadow-inner cursor-pointer">
                  <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <div className="bg-white/40 border border-white/50 p-6 rounded-2xl flex justify-between items-center opacity-70">
                <div>
                  <div className="font-bold text-slate-800 text-lg">Target Audience</div>
                  <div className="text-slate-500">Software Engineers</div>
                </div>
                <div className="w-8 h-8 border-2 border-slate-400 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Testimonial Section */}
      <section className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[40px] p-12 lg:p-24 shadow-2xl relative overflow-hidden text-center">
            {/* Mesh specifically for the testimonial box to match the Mackie Clonts reference */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c4f051] rounded-full mix-blend-multiply filter blur-[120px] opacity-80 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none z-0"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <svg className="w-12 h-12 text-[#1e293b] mb-10 mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              <p className="text-3xl md:text-5xl font-bold text-slate-800 leading-[1.3] mb-12 tracking-tight">
                "PromotAI has completely transformed our B2B acquisition strategy. We are <span className="relative z-10"><span className="absolute bottom-1 left-[-2%] w-[104%] h-[40%] bg-[#c4f051] -z-10 rounded-sm transform rotate-1"></span>extremely impressed</span> with the quality of developers we're reaching."
              </p>
              <div className="flex items-center justify-center gap-5">
                <div className="w-16 h-16 bg-slate-300 rounded-full overflow-hidden border-2 border-white shadow-md">
                  {/* Using an abstract CSS avatar instead of a random image URL for safety, or a reliable placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">MC</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-xl">Mackie Clonts</div>
                  <div className="text-slate-600 font-medium">Project Manager, CareRev</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section & Footer */}
      <footer className="pt-32 relative overflow-hidden z-10 border-t border-white/40 bg-white/20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 text-center mb-32">
          <h2 className="text-5xl lg:text-7xl font-extrabold mb-8 text-slate-800 tracking-tight">Ready to reach the AI generation?</h2>
          <p className="text-slate-600 text-2xl mb-12 max-w-2xl mx-auto font-medium">Join hundreds of companies advertising directly inside the tools professionals use every day.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-10 py-5 bg-[#1e293b] text-white rounded-2xl font-bold hover:bg-slate-800 hover:-translate-y-1 shadow-2xl shadow-slate-900/20 transition-all text-lg border border-transparent">
              Start Building Campaigns
            </Link>
            <Link href="/contact" className="px-10 py-5 bg-white/60 text-slate-800 rounded-2xl font-bold hover:bg-white hover:-translate-y-1 shadow-sm transition-all text-lg border border-white/80">
              Contact Sales
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-white/40 pt-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#1e293b]">PromotAI</span>
              </div>
              <p className="text-slate-600 font-medium max-w-sm">The first native advertising platform for AI chatbots. Your AI thinks, you earn.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li><Link href="#" className="hover:text-slate-900 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 font-medium border-t border-white/40 pt-8">
            <p>© 2026 PromotAI Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
