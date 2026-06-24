'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-paper-cream font-sans selection:bg-riso-coral selection:text-paper-cream overflow-x-hidden">
      
      {/* Left Column - Graphic/Brand */}
      <div className="w-full md:w-1/2 relative bg-riso-coral border-b-[4px] md:border-b-0 md:border-r-[4px] border-ink-black flex flex-col justify-between p-12 overflow-hidden">
        {/* Halftone texture overlay */}
        <div className="absolute inset-0 bg-halftone opacity-30 z-0 mix-blend-overlay"></div>
        
        {/* Logo area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-paper-cream border-[3px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-black)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
          </div>
          <span className="font-display font-black text-4xl tracking-tight text-ink-black">PromotAI</span>
        </div>

        {/* Hero image area */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-12 mb-12">
          <div className="w-full max-w-md aspect-[4/3] bg-paper-cream border-[4px] border-ink-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-4 transform -rotate-2 hover:-rotate-1 transition-transform overflow-hidden cursor-pointer">
            <div className="w-full h-full border-2 border-ink-black/20"
              style={{
                backgroundImage: "url('/halftone_clouds.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="font-display font-black text-5xl text-ink-black leading-[0.9] tracking-tighter uppercase mb-4">
            Sky's The Limit
          </h2>
          <p className="font-bold text-lg text-ink-black bg-paper-cream/80 p-4 border-[4px] border-ink-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-1">
            Create an account to start deploying your campaigns directly into the world's most popular AI environments.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 bg-paper-cream flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="absolute top-8 right-8 text-6xl lg:text-8xl font-display font-black text-ink-black opacity-5 transform rotate-12 pointer-events-none">
          JOIN NOW
        </div>
        
        <div className="w-full max-w-md bg-paper-cream border-[4px] border-ink-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-10 transform rotate-1 relative z-10">
          <div className="mb-10 text-center">
            <h1 className="font-display font-black text-5xl text-ink-black uppercase tracking-tighter drop-shadow-sm">Onboard</h1>
            <p className="text-ink-muted font-bold mt-2">Initialize your advertiser profile.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-riso-coral border-[3px] border-ink-black p-4 text-ink-black font-bold text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-1">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border-[3px] border-ink-black px-4 py-4 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-coral/30 text-base transition-all shadow-inner"
              />
            </div>
            
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border-[3px] border-ink-black px-4 py-4 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-coral/30 text-base transition-all shadow-inner"
              />
            </div>
            
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border-[3px] border-ink-black px-4 py-4 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-coral/30 text-base transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="interactive-lift w-full bg-riso-coral border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] text-ink-black font-display font-black py-5 px-4 uppercase tracking-widest text-xl mt-6 transition-all disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t-[3px] border-ink-black text-center">
            <p className="text-ink-muted font-bold">
              Already enlisted? <Link href="/login" className="text-riso-coral hover:text-ink-black underline decoration-[3px] underline-offset-4 font-black transition-colors">Log in</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
