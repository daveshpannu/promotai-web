'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created, but auto-login failed. Please sign in manually.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-lacquer-black flex flex-col md:flex-row">
      {/* Left Column: Brand Story (Impeccable Neo-Kinpaku) */}
      <div className="w-full md:w-1/2 bg-lacquer-deep border-r border-gold-hairline p-8 md:p-16 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="text-kinpaku-gold font-sans font-medium uppercase tracking-[0.15em] text-sm">
            PromotAI
          </div>
        </motion.div>

        <div className="my-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-5xl md:text-7xl font-light text-champagne leading-[1.02] tracking-[-0.01em] max-w-[12ch]"
          >
            Become a partner.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 text-text-muted text-lg max-w-[35ch] leading-relaxed"
          >
            Join the exclusive network of brands leveraging AI chatbot injection. High leverage. Zero noise.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs font-mono text-gold-hairline-strong uppercase tracking-[0.22em]"
        >
          Node Authorization // Awaiting Clearance
        </motion.div>
      </div>

      {/* Right Column: Registration */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-10">
            <h2 className="font-display text-4xl text-champagne mb-2">Initialize Account</h2>
            <p className="text-text-faint text-sm">Create your advertiser profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-patina/10 border border-patina/30 text-patina px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-raised-lacquer border border-gold-hairline rounded-sm px-4 py-3 text-champagne focus:outline-none focus:border-gold-hairline-strong transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-raised-lacquer border border-gold-hairline rounded-sm px-4 py-3 text-champagne focus:outline-none focus:border-gold-hairline-strong transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-raised-lacquer border border-gold-hairline rounded-sm px-4 py-3 text-champagne focus:outline-none focus:border-gold-hairline-strong transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kinpaku-gold text-lacquer-deep hover:bg-kinpaku-pale disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-sm"
            >
              {loading ? 'Initializing...' : 'Request Clearance'}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-8">
            Already registered?{' '}
            <a href="/login" className="text-kinpaku-gold hover:text-kinpaku-pale transition-colors border-b border-transparent hover:border-kinpaku-pale">
              Sign in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
