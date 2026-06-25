'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-[#e8e8e6] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* --- BACKGROUND WITH PAPER CUT OCEAN IMAGE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img src="/paper_ocean_bg.jpg" alt="Ocean Background" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#e8e8e6]/80 via-transparent to-[#e8e8e6]/60"></div>
      </div>
      
      {/* Left Column - Graphic/Brand */}
      <div className="w-full md:w-[45%] relative flex flex-col justify-between p-12 overflow-hidden z-10">
        
        {/* Logo area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-xl shadow-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
          </div>
          <span className="font-display font-medium text-3xl tracking-tight text-gray-900 drop-shadow-sm">PromotAI</span>
        </div>

        <div className="relative z-10 max-w-md mt-auto">
          <h2 className="font-display font-medium text-6xl text-gray-900 leading-[1.05] tracking-tight mb-6 drop-shadow-md">
            Navigate the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic">Ad Sea</span>
          </h2>
          <p className="font-light text-lg text-gray-600 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-xl shadow-blue-900/5">
            Log in to manage your campaigns, review analytics, and chart a course for your brand across major AI interfaces.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
        
        <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-12 transition-all duration-500 hover:shadow-blue-900/20">
          <div className="mb-10 text-center">
            <h1 className="font-display font-medium text-4xl text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Enter your credentials to access the terminal.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl text-center text-sm font-medium shadow-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 ml-2">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/80 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="you@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 ml-2">PASSWORD</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/80 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold py-4 px-4 text-lg mt-8 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              No account? <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
