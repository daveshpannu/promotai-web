'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderAuthMenuProps {
  mode?: 'all' | 'earnings';
}

export default function HeaderAuthMenu({ mode = 'all' }: HeaderAuthMenuProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'advertiser' | 'viewer'>(mode === 'earnings' ? 'viewer' : 'advertiser');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const isEarningsMode = mode === 'earnings';

  // Ensure role matches mode when opening
  useEffect(() => {
    if (isEarningsMode) {
      setRole('viewer');
    }
  }, [isEarningsMode]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleGoogleAuth = async (targetRole: 'advertiser' | 'viewer' = role) => {
    setLoadingGoogle(true);
    setError('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('promotai_role', targetRole);
      }

      const statusRes = await fetch('/api/auth/google-status');
      const { configured } = await statusRes.json().catch(() => ({ configured: false }));

      if (configured) {
        await signIn('google', { callbackUrl: `/dashboard?role=${targetRole}` });
        return;
      }

      // Fallback simulated sign-in for development when AUTH_GOOGLE_ID is unset
      const googleEmail = targetRole === 'advertiser' ? 'advertiser.demo@gmail.com' : 'viewer.demo@gmail.com';
      const googleName = targetRole === 'advertiser' ? 'Alex Rivera (Google)' : 'Jordan Lee (Google Earner)';

      const res = await signIn('credentials', {
        redirect: false,
        email: googleEmail,
        authType: 'google',
        role: targetRole,
        name: googleName,
      });

      if (res?.error) {
        setError('Authentication failed');
      } else {
        setIsOpen(false);
        router.push(`/dashboard?role=${targetRole}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  // If user is already authenticated
  if (status === 'authenticated' && session?.user) {
    if (isEarningsMode) {
      return (
        <Link
          href="/dashboard?role=viewer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-full transition-all duration-300 border border-emerald-200/80 shadow-xs hover:shadow-md"
        >
          <span className="text-base">💰</span>
          <span>My Earnings</span>
        </Link>
      );
    }

    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-full transition-all duration-300 border border-gray-200/60"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center text-[10px] font-bold uppercase">
            {session.user.name ? session.user.name[0] : (session.user.email ? session.user.email[0] : 'U')}
          </div>
          <span className="max-w-[100px] truncate">{session.user.name || session.user.email?.split('@')[0]}</span>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-2xl shadow-blue-900/15 rounded-2xl p-3 z-50 font-sans"
            >
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{session.user.email}</p>
              </div>

              <Link
                href="/dashboard?role=viewer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors mb-1"
              >
                <span className="text-sm">💰</span>
                <span>User Earnings Portal</span>
              </Link>

              <Link
                href="/dashboard?role=advertiser"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50/60 rounded-xl transition-colors mb-1"
              >
                <span className="text-sm">📢</span>
                <span>Advertiser Studio</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors text-left"
              >
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- UNCONNECTED / GUEST VIEW ---
  return (
    <div className="relative" ref={menuRef}>
      {isEarningsMode ? (
        <button
          type="button"
          onClick={() => {
            setRole('viewer');
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="text-sm">💰</span>
          <span>Check Earnings</span>
          <svg className={`w-3.5 h-3.5 text-emerald-100 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300"
        >
          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" x2="3" y1="12" y2="12"/>
          </svg>
          <span>Log In</span>
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-[330px] sm:w-[390px] bg-white/95 backdrop-blur-3xl border border-gray-100 shadow-2xl shadow-blue-900/20 rounded-[2rem] p-5 sm:p-6 z-50 font-sans"
          >
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{isEarningsMode ? '💰' : '🔐'}</span>
                <h3 className="font-display font-medium text-lg text-gray-900 tracking-tight">
                  {isEarningsMode ? 'User Earnings Portal' : 'Access PromotAI'}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isEarningsMode
                  ? 'Sign in to check your live balance, daily rupee gains & withdraw payouts:'
                  : 'Choose your authentication method to continue:'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-2.5 rounded-xl text-center text-xs font-medium mb-3">
                {error}
              </div>
            )}

            {!isEarningsMode && (
              /* Role selector for general login */
              <div className="grid grid-cols-2 p-1 bg-gray-100/90 rounded-xl mb-3 border border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`py-1.5 rounded-lg font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                    role === 'viewer'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>💰</span>
                  <span>See Earnings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('advertiser')}
                  className={`py-1.5 rounded-lg font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                    role === 'advertiser'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>📢</span>
                  <span>Post Ads</span>
                </button>
              </div>
            )}

            <div className="space-y-3.5">
              {/* --- OPTION 1: USERNAME & PASSWORD --- */}
              <div className="bg-gray-50/90 border border-gray-200/70 rounded-2xl p-4 transition-all hover:border-gray-300">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isEarningsMode ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Option 1: Username & Password
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {isEarningsMode
                        ? 'Sign in with your user credentials'
                        : 'Standard credentials authentication'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link
                    href={`/login`}
                    onClick={() => {
                      if (typeof window !== 'undefined') localStorage.setItem('promotai_role', role);
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2 px-3 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    🔑 Log In
                  </Link>
                  <Link
                    href={`/register`}
                    onClick={() => {
                      if (typeof window !== 'undefined') localStorage.setItem('promotai_role', role);
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2 px-3 bg-white border border-gray-200 hover:border-teal-500 hover:text-teal-700 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    ✨ Sign Up
                  </Link>
                </div>
              </div>

              {/* --- OPTION 2: GOOGLE LOGIN OR SIGNUP --- */}
              <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/40 to-blue-50/40 border border-emerald-100/90 rounded-2xl p-4 transition-all hover:border-emerald-200">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs text-gray-700 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Option 2: Google Authentication
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {isEarningsMode
                        ? '1-click login to your earnings wallet'
                        : '1-click login or signup with Google'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleAuth(isEarningsMode ? 'viewer' : role)}
                  disabled={loadingGoogle}
                  className="w-full mt-3 bg-white border border-gray-200/80 hover:border-gray-300 text-gray-700 font-semibold py-2.5 px-3 rounded-xl shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 text-xs group disabled:opacity-60 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>
                    {loadingGoogle
                      ? 'Connecting with Google...'
                      : isEarningsMode
                      ? 'Continue with Google (Earnings Portal)'
                      : `Continue with Google as ${role === 'advertiser' ? 'Advertiser' : 'Earner'}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer hint */}
            <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <span>⚡ Earn ₹0.15 - ₹0.50 per sponsor</span>
              <span>UPI & AI vouchers</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
