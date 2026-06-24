'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';

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
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const buildingY = useTransform(scrollYProgress, [0, 1], [300, -200]);

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

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
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
      <div className="min-h-[100dvh] bg-[#fdfbf7] flex items-center justify-center">
        <div className="text-gray-400 font-display font-medium text-2xl animate-pulse">Loading Workspace...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-[100dvh] bg-[#fdfbf7] p-6 md:p-12 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* Floating Parallax Assets */}
      <motion.div 
        style={{ y: cloudY }}
        className="fixed top-[10%] right-[-10%] w-[500px] mix-blend-multiply opacity-50 pointer-events-none z-0"
      >
        <img src="/paper_cloud_1.png" alt="Cloud" className="w-full h-auto filter grayscale" />
      </motion.div>

      <motion.div 
        style={{ y: buildingY }}
        className="fixed bottom-[-10%] left-[-10%] w-[800px] mix-blend-multiply opacity-80 pointer-events-none z-0"
      >
        <img src="/paper_buildings.png" alt="Buildings" className="w-full h-auto drop-shadow-md" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5"
        >
          <div>
            <h1 className="font-display font-medium text-4xl md:text-5xl text-gray-900 tracking-tight">
              Campaign Deck
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Advertiser: {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={() => signOut()}
              className="text-sm font-semibold bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 hover:text-gray-900 transition-all"
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
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10 relative transition-transform duration-500 hover:shadow-blue-900/15">
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="font-display font-medium text-2xl text-gray-900 tracking-tight">
                  {editingId ? 'Edit Blueprint' : 'New Blueprint'}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Image Upload */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 ml-1">VISUAL ASSET</label>
                  <div className="border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-6 text-center transition-all hover:bg-gray-100 cursor-pointer group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                        {uploading ? 'Processing...' : 'Upload Image'}
                      </div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or enter static URL..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 mt-2 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 ml-1">PUNCHY COPY</label>
                  <textarea
                    required
                    value={formData.quote}
                    onChange={e => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Grab their attention..."
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm resize-none shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 ml-1">TARGET URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 ml-1">PLACEMENT</label>
                    <select
                      value={formData.targetChatbot}
                      onChange={e => setFormData({ ...formData, targetChatbot: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="all">Global (All)</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 ml-1">WEIGHT</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold py-4 px-4 text-sm mt-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                >
                  {editingId ? 'Save Edits' : 'Publish Ad'}
                </button>
              </form>
            </div>

            {/* Ad Preview Simulator */}
            {(formData.imageUrl || formData.quote) && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10 relative transition-transform duration-500 hover:shadow-blue-900/15">
                <h3 className="font-display font-medium text-xl text-gray-900 mb-5 tracking-tight">Preview</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Sponsored</div>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {formData.quote && (
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
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
            className="lg:col-span-8 relative z-10"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-72 bg-gray-100 rounded-[2rem] animate-pulse"></div>
                <div className="h-72 bg-gray-100 rounded-[2rem] animate-pulse delay-75"></div>
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-md border border-dashed border-gray-300 rounded-[3rem] p-16 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-400 font-medium text-xl">No active campaigns. Time to build.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad, i) => {
                  const ctr = ad.totalViews > 0 ? ((ad.totalClicks / ad.totalViews) * 100).toFixed(2) : '0.00';
                  const isFeatured = i === 0 && ads.length % 2 !== 0;

                  return (
                    <motion.div 
                      key={ad.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.23, 1, 0.32, 1] }}
                      className={`bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 shadow-xl ${ad.isActive ? 'shadow-blue-900/5 hover:shadow-blue-900/15 hover:-translate-y-1' : 'opacity-70 grayscale-[20%] shadow-sm'} ${isFeatured ? 'md:col-span-2 md:flex-row' : ''}`}
                    >
                      {/* Image Area */}
                      <div className={`relative overflow-hidden ${isFeatured ? 'md:w-[45%] h-full min-h-[240px]' : 'h-48'} bg-gray-100`}>
                        <img src={ad.imageUrl} alt="Ad" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-4 right-4">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${ad.isActive ? 'bg-green-500/90 text-white' : 'bg-gray-800/80 text-white'}`}>
                            {ad.isActive ? 'Live' : 'Paused'}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className={`flex-1 p-6 flex flex-col ${isFeatured ? 'md:w-[55%]' : ''}`}>
                        <p className="text-gray-900 font-medium leading-relaxed mb-6 flex-1 text-sm bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                          &quot;{ad.quote}&quot;
                        </p>
                        
                        {/* Metrics Row */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Views</div>
                            <div className="font-display font-medium text-xl text-gray-900">{ad.totalViews.toLocaleString()}</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Clicks</div>
                            <div className="font-display font-medium text-xl text-gray-900">{ad.totalClicks.toLocaleString()}</div>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                            <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1">CTR</div>
                            <div className="font-display font-medium text-xl text-blue-600">{ctr}%</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleToggleStatus(ad)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${ad.isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/20'}`}
                          >
                            {ad.isActive ? 'Pause' : 'Activate'}
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(ad)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(ad.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
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
