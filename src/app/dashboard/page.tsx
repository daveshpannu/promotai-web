'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import AnalyticsChart from '@/components/AnalyticsChart';

interface Ad {
  id: string;
  imageUrl: string;
  quote: string;
  link: string;
  targetChatbot: string;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  totalViews: number;
  totalClicks: number;
  createdAt: string;
}

interface ChartData {
  date: string;
  views: number;
  clicks: number;
}

export default function AdvertiserPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedAnalytics, setExpandedAnalytics] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    quote: '',
    link: '',
    targetChatbot: 'all',
    priority: 1,
    startDate: '',
    endDate: '',
  });

  // Auth redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchAds();
  }, [status]);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (adId: string) => {
    if (expandedAnalytics === adId) {
      setExpandedAnalytics(null);
      return;
    }
    setChartLoading(true);
    setExpandedAnalytics(adId);
    try {
      const res = await fetch(`/api/ads/${adId}/analytics`);
      const data = await res.json();
      setChartData(data.chartData || []);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      priority: Number(formData.priority) || 1,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/ads/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          cancelEdit();
          fetchAds();
        }
      } else {
        const res = await fetch('/api/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          resetForm();
          fetchAds();
        }
      }
    } catch (err) {
      console.error('Failed to save ad', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAds();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleToggleStatus = async (ad: Ad) => {
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      if (res.ok) fetchAds();
    } catch (err) {
      console.error('Failed to toggle', err);
    }
  };

  const startEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setFormData({
      imageUrl: ad.imageUrl,
      quote: ad.quote,
      link: ad.link,
      targetChatbot: ad.targetChatbot,
      priority: ad.priority,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ imageUrl: '', quote: '', link: '', targetChatbot: 'all', priority: 1, startDate: '', endDate: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[100dvh] bg-lacquer-black flex items-center justify-center">
        <div className="text-kinpaku-gold text-sm tracking-[0.2em] uppercase font-mono animate-pulse">Initializing Data Stream...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-lacquer-black p-6 md:p-12 font-sans selection:bg-kinpaku-gold selection:text-lacquer-black">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gold-hairline pb-8"
        >
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-champagne leading-none tracking-tight">
              Control Panel
            </h1>
            <p className="text-text-muted mt-2 text-sm">
              Terminal: {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={() => signOut()}
              className="text-xs uppercase tracking-widest font-mono border border-gold-hairline hover:border-kinpaku-gold text-text-muted hover:text-kinpaku-gold px-6 py-3 transition-colors bg-raised-lacquer"
            >
              Terminate Session
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form + Preview (col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-4 space-y-8"
          >
            {/* Ad Form */}
            <div className="bg-raised-lacquer border border-gold-hairline p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-kinpaku-gold" />
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-3xl text-champagne">
                  {editingId ? 'Edit Vector' : 'New Inject'}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-mono tracking-wider text-patina hover:text-white uppercase">Abort</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Creative Asset</label>
                  <div className="border border-dashed border-gold-hairline-strong bg-lacquer-black p-6 text-center transition-colors hover:border-kinpaku-gold cursor-pointer group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                      <div className="text-sm text-text-warm group-hover:text-kinpaku-gold transition-colors">
                        {uploading ? 'Transmitting...' : 'Upload Asset'}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-text-faint mt-2">Max 5MB</div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or enter static URL..."
                    className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 mt-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Copy Payload</label>
                  <textarea
                    required
                    value={formData.quote}
                    onChange={e => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Enter short, punchy copy."
                    rows={3}
                    className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Target URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Environment</label>
                    <select
                      value={formData.targetChatbot}
                      onChange={e => setFormData({ ...formData, targetChatbot: e.target.value })}
                      className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors appearance-none"
                    >
                      <option value="all">Global (All)</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Weight</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Start (UTC)</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">End (UTC)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-lacquer-deep border border-gold-hairline px-4 py-3 text-champagne focus:outline-none focus:border-kinpaku-gold text-sm transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-kinpaku-gold hover:bg-kinpaku-pale text-lacquer-deep font-medium py-4 px-4 uppercase tracking-widest text-xs mt-6 transition-all"
                >
                  {editingId ? 'Commit Changes' : 'Deploy Payload'}
                </button>
              </form>
            </div>

            {/* Ad Preview Simulator */}
            {(formData.imageUrl || formData.quote) && (
              <div className="bg-raised-lacquer border border-gold-hairline p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-graphite" />
                <h3 className="font-display text-2xl text-champagne mb-6">Render Preview</h3>
                <div className="relative">
                  <div
                    style={{
                      background: 'rgba(21, 21, 21, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontFamily: "'Albert Sans', sans-serif",
                    }}
                    className="p-4 rounded-sm"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-text-faint mb-3 border-b border-white/5 pb-2">
                      Sponsored Injection
                    </div>
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover bg-lacquer-deep border border-white/5 mb-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {formData.quote && (
                      <p className="text-sm text-champagne leading-relaxed">
                        {formData.quote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Campaigns Bento Grid (col-span-8) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-8"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-raised-lacquer border border-gold-hairline animate-pulse"></div>
                <div className="h-64 bg-raised-lacquer border border-gold-hairline animate-pulse delay-75"></div>
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-raised-lacquer border border-gold-hairline border-dashed p-16 flex items-center justify-center min-h-[400px]">
                <p className="text-text-muted font-display text-2xl text-center">No active payloads. Standing by.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad, i) => {
                  const ctr = ad.totalViews > 0 ? ((ad.totalClicks / ad.totalViews) * 100).toFixed(2) : '0.00';
                  // Bento logic: First item spans 2 cols if there are odd number of items, or just standard 1 col.
                  const isFeatured = i === 0 && ads.length % 2 !== 0;

                  return (
                    <motion.div 
                      key={ad.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.23, 1, 0.32, 1] }}
                      className={`bg-raised-lacquer border ${ad.isActive ? 'border-gold-hairline hover:border-kinpaku-gold/50' : 'border-white/5 opacity-50'} flex flex-col group transition-colors ${isFeatured ? 'md:col-span-2 md:flex-row' : ''}`}
                    >
                      {/* Image Area */}
                      <div className={`relative overflow-hidden bg-lacquer-deep ${isFeatured ? 'md:w-1/2 h-full min-h-[240px]' : 'h-48'}`}>
                        <img src={ad.imageUrl} alt="Ad" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          <div className={`px-2 py-1 text-[10px] uppercase font-mono tracking-widest border bg-lacquer-black/80 backdrop-blur ${ad.isActive ? 'text-kinpaku-gold border-kinpaku-gold/30' : 'text-text-faint border-white/10'}`}>
                            {ad.isActive ? 'Live' : 'Halted'}
                          </div>
                          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-widest border bg-lacquer-black/80 backdrop-blur text-champagne border-white/10">
                            {ad.targetChatbot === 'all' ? 'Omni' : ad.targetChatbot}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className={`flex-1 p-6 flex flex-col ${isFeatured ? 'md:w-1/2' : ''}`}>
                        <p className="text-champagne font-medium leading-relaxed mb-4 flex-1">
                          &quot;{ad.quote}&quot;
                        </p>
                        
                        {/* Metrics Bento Row */}
                        <div className="grid grid-cols-3 gap-px bg-gold-hairline mb-6 border border-gold-hairline">
                          <div className="bg-raised-lacquer p-3 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">Views</div>
                            <div className="font-display text-2xl text-champagne">{ad.totalViews.toLocaleString()}</div>
                          </div>
                          <div className="bg-raised-lacquer p-3 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">Clicks</div>
                            <div className="font-display text-2xl text-champagne">{ad.totalClicks.toLocaleString()}</div>
                          </div>
                          <div className="bg-raised-lacquer p-3 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">CTR</div>
                            <div className="font-display text-2xl text-patina">{ctr}%</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-gold-hairline">
                          <button
                            onClick={() => handleToggleStatus(ad)}
                            className={`text-xs font-mono uppercase tracking-widest ${ad.isActive ? 'text-patina hover:text-white' : 'text-kinpaku-gold hover:text-kinpaku-pale'}`}
                          >
                            {ad.isActive ? 'Suspend' : 'Activate'}
                          </button>
                          <div className="flex gap-4">
                            <button onClick={() => startEdit(ad)} className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-white">Edit</button>
                            <button onClick={() => handleDelete(ad.id)} className="text-xs font-mono uppercase tracking-widest text-red-500 hover:text-red-400">Purge</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
