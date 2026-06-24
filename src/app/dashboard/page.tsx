'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { RevealStagger } from '@/components/Reveal';

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

export default function AdvertiserPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      <div className="min-h-[100dvh] bg-paper-cream flex items-center justify-center">
        <div className="text-ink-black font-display font-black text-2xl uppercase tracking-tighter animate-pulse drop-shadow-sm">Loading Canvas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-paper-cream p-6 md:p-12 font-sans selection:bg-riso-blue selection:text-paper-cream overflow-x-hidden relative">
      
      {/* Background Halftone Decorative Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-halftone rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-halftone rounded-full opacity-20 transform translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-[4px] border-ink-black pb-8"
        >
          <div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-ink-black leading-none tracking-tighter uppercase drop-shadow-sm transform -rotate-1">
              Campaign Deck
            </h1>
            <p className="text-ink-muted mt-2 font-bold bg-paper-dim border-2 border-ink-black px-3 py-1 inline-block transform rotate-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              Advertiser: {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={() => signOut()}
              className="interactive-lift text-sm font-black uppercase tracking-widest bg-paper-cream border-[3px] border-ink-black text-ink-black px-6 py-3 shadow-brutal hover:shadow-brutal-hover"
            >
              Log Out
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form + Preview (col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-4 space-y-8"
          >
            {/* Ad Form */}
            <div className="bg-riso-blue border-[4px] border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative transform -rotate-1">
              <div className="absolute inset-0 bg-halftone pointer-events-none opacity-30 mix-blend-overlay"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="font-display font-black text-3xl text-paper-cream uppercase tracking-tight drop-shadow-md">
                  {editingId ? 'Edit Draft' : 'New Blueprint'}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-black bg-paper-cream border-2 border-ink-black text-ink-black px-2 py-1 uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">Abort</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Image Upload */}
                <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Visual Asset</label>
                  <div className="border-[3px] border-dashed border-ink-muted bg-paper-dim p-6 text-center transition-all hover:bg-riso-blue/10 cursor-pointer group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                      <div className="text-base font-bold text-ink-black group-hover:text-riso-blue transition-colors">
                        {uploading ? 'Processing...' : 'Click to Upload'}
                      </div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or enter static URL..."
                    className="w-full bg-white border-2 border-ink-black px-4 py-3 mt-3 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-blue/30 text-sm transition-all"
                  />
                </div>

                <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Punchy Copy</label>
                  <textarea
                    required
                    value={formData.quote}
                    onChange={e => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Grab their attention..."
                    rows={3}
                    className="w-full bg-white border-2 border-ink-black px-4 py-3 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-blue/30 text-sm transition-all resize-none"
                  />
                </div>

                <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Target URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white border-2 border-ink-black px-4 py-3 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-blue/30 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Placement</label>
                    <select
                      value={formData.targetChatbot}
                      onChange={e => setFormData({ ...formData, targetChatbot: e.target.value })}
                      className="w-full bg-white border-2 border-ink-black px-2 py-3 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-blue/30 text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">Global (All)</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                    </select>
                  </div>
                  <div className="bg-paper-cream border-[3px] border-ink-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <label className="block text-sm font-black uppercase tracking-widest text-ink-black mb-2">Weight</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border-2 border-ink-black px-4 py-3 text-ink-black font-bold focus:outline-none focus:ring-4 focus:ring-riso-blue/30 text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="interactive-lift w-full bg-riso-coral border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] text-ink-black font-display font-black py-4 px-4 uppercase tracking-widest text-xl mt-6 transition-all"
                >
                  {editingId ? 'Save Edits' : 'Publish Ad'}
                </button>
              </form>
            </div>

            {/* Ad Preview Simulator */}
            {(formData.imageUrl || formData.quote) && (
              <div className="bg-paper-cream border-[4px] border-ink-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative transform rotate-1">
                <h3 className="font-display font-black text-3xl text-ink-black mb-6 uppercase tracking-tighter">Preview</h3>
                <div className="relative border-[3px] border-ink-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-4 bg-white">
                  <div className="text-xs font-black uppercase tracking-widest text-riso-blue mb-3 border-b-2 border-ink-black/10 pb-2">
                    Sponsored Box
                  </div>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover border-2 border-ink-black mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {formData.quote && (
                    <p className="text-sm text-ink-black font-bold leading-relaxed">
                      {formData.quote}
                    </p>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-72 bg-paper-dim border-[4px] border-ink-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-pulse"></div>
                <div className="h-72 bg-paper-dim border-[4px] border-ink-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-pulse delay-75"></div>
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-paper-cream border-[4px] border-dashed border-ink-black p-16 flex items-center justify-center min-h-[400px] transform rotate-1">
                <p className="text-ink-muted font-display font-black text-3xl text-center uppercase">No active campaigns. Time to build.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ads.map((ad, i) => {
                  const ctr = ad.totalViews > 0 ? ((ad.totalClicks / ad.totalViews) * 100).toFixed(2) : '0.00';
                  // Bento logic: First item spans 2 cols if there are odd number of items.
                  const isFeatured = i === 0 && ads.length % 2 !== 0;

                  return (
                    <motion.div 
                      key={ad.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.23, 1, 0.32, 1] }}
                      className={`bg-paper-cream border-[4px] ${ad.isActive ? 'border-ink-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]' : 'border-ink-muted shadow-none opacity-80'} flex flex-col group transition-all transform ${isFeatured ? 'md:col-span-2 md:flex-row' : ''} ${i % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`}
                    >
                      {/* Image Area */}
                      <div className={`relative overflow-hidden border-b-[4px] ${isFeatured ? 'md:border-b-0 md:border-r-[4px] md:w-1/2 h-full min-h-[240px]' : 'h-48'} border-ink-black bg-white`}>
                        <img src={ad.imageUrl} alt="Ad" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          <div className={`px-3 py-1 text-xs uppercase font-black tracking-widest border-2 border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${ad.isActive ? 'bg-riso-coral text-ink-black' : 'bg-paper-dim text-ink-muted'}`}>
                            {ad.isActive ? 'Live' : 'Paused'}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className={`flex-1 p-6 flex flex-col ${isFeatured ? 'md:w-1/2' : ''}`}>
                        <p className="text-ink-black font-bold leading-relaxed mb-6 flex-1 text-lg">
                          &quot;{ad.quote}&quot;
                        </p>
                        
                        {/* Metrics Bento Row */}
                        <div className="grid grid-cols-3 gap-0 border-[3px] border-ink-black mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                          <div className="bg-paper-cream p-3 text-center border-r-[3px] border-ink-black">
                            <div className="text-[10px] font-black uppercase tracking-widest text-ink-muted mb-1">Views</div>
                            <div className="font-display font-black text-2xl text-ink-black">{ad.totalViews.toLocaleString()}</div>
                          </div>
                          <div className="bg-paper-cream p-3 text-center border-r-[3px] border-ink-black">
                            <div className="text-[10px] font-black uppercase tracking-widest text-ink-muted mb-1">Clicks</div>
                            <div className="font-display font-black text-2xl text-ink-black">{ad.totalClicks.toLocaleString()}</div>
                          </div>
                          <div className="bg-riso-blue p-3 text-center">
                            <div className="text-[10px] font-black uppercase tracking-widest text-paper-cream mb-1">CTR</div>
                            <div className="font-display font-black text-2xl text-paper-cream">{ctr}%</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t-[3px] border-ink-black">
                          <button
                            onClick={() => handleToggleStatus(ad)}
                            className={`interactive-lift px-4 py-2 border-2 border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-xs font-black uppercase tracking-widest ${ad.isActive ? 'bg-paper-dim text-ink-black hover:bg-paper-cream' : 'bg-riso-coral text-ink-black hover:bg-[#ff8a66]'}`}
                          >
                            {ad.isActive ? 'Pause' : 'Activate'}
                          </button>
                          <div className="flex gap-4">
                            <button onClick={() => startEdit(ad)} className="text-sm font-black uppercase tracking-widest text-ink-muted hover:text-riso-blue transition-colors underline decoration-2 underline-offset-4">Edit</button>
                            <button onClick={() => handleDelete(ad.id)} className="text-sm font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors underline decoration-2 underline-offset-4">Delete</button>
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
