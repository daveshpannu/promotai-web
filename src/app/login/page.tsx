'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState<'advertiser' | 'viewer'>('advertiser');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('promotai_role', selectedRole);
      }

      // Check if real Google OAuth credentials are set
      const statusRes = await fetch('/api/auth/google-status');
      const { configured } = await statusRes.json().catch(() => ({ configured: false }));

      if (configured) {
        await signIn('google', { callbackUrl: `/dashboard?role=${selectedRole}` });
        return;
      }

      // Fallback: simulated Google sign-in for development when AUTH_GOOGLE_ID is unset
      const googleEmail = selectedRole === 'advertiser' ? 'advertiser.demo@gmail.com' : 'viewer.demo@gmail.com';
      const googleName = selectedRole === 'advertiser' ? 'Alex Rivera (Google)' : 'Jordan Lee (Google Viewer)';
      
      const res = await signIn('credentials', {
        redirect: false,
        email: googleEmail,
        authType: 'google',
        role: selectedRole,
        name: googleName,
      });

      if (res?.error) {
        setError('Google authentication failed');
      } else {
        router.push(`/dashboard?role=${selectedRole}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
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
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-[#fdfbf7] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* --- PARALLAX BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-halftone-sky">
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [-2, 2, -2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[-10%] w-[500px] mix-blend-multiply opacity-60 filter grayscale"
        >
          <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-auto" />
        </motion.div>
      </div>
      
      {/* Left Column - Graphic/Brand */}
      <div className="w-full md:w-[45%] relative flex flex-col justify-between p-12 overflow-hidden z-10">

        {/* Logo area */}
        <Link href="/" className="relative z-10 flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
          </div>
          <span className="font-display font-medium text-3xl tracking-tight text-gray-900 drop-shadow-sm">PromotAI</span>
        </Link>

        <div className="relative z-10 max-w-md mt-auto">
          <h2 className="font-display font-medium text-6xl text-gray-900 leading-[1.05] tracking-tight mb-6 drop-shadow-md">
            Navigate the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic">Ad Sea</span>
          </h2>
          <p className="font-light text-lg text-gray-600 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-xl shadow-blue-900/5">
            Log in to post ad campaigns across ChatGPT & Claude, or sign in as a viewer to manage your extension preferences.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
        
        <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-blue-900/20">
          <div className="mb-6 text-center">
            <h1 className="font-display font-medium text-4xl text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-sm">Select your account type to continue.</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-gray-100/80 rounded-2xl mb-6 border border-gray-200/50">
            <button
              type="button"
              onClick={() => setSelectedRole('advertiser')}
              className={`py-2.5 rounded-xl font-semibold text-xs transition-all ${selectedRole === 'advertiser' ? 'bg-white text-blue-600 shadow-md shadow-gray-200/50 scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              📢 Post Ads (Advertiser)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('viewer')}
              className={`py-2.5 rounded-xl font-semibold text-xs transition-all ${selectedRole === 'viewer' ? 'bg-white text-cyan-600 shadow-md shadow-gray-200/50 scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              👀 See Ads (Viewer)
            </button>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-200/80 hover:border-gray-300 text-gray-700 font-semibold py-3.5 px-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 mb-6 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white/80 backdrop-blur-md px-3 text-xs font-bold text-gray-400 absolute uppercase">or credentials</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-2xl text-center text-xs font-medium shadow-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 ml-2">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/80 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="you@company.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 ml-2">PASSWORD</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/80 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold py-3.5 px-4 text-base mt-4 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Authenticating...' : `Log In as ${selectedRole === 'advertiser' ? 'Advertiser' : 'Viewer'}`}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-medium">
              No account? <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
