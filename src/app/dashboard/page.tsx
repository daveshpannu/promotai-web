'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
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
  const { theme, toggleTheme } = useTheme();
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

  const isDark = theme === 'dark';

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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  // ---- Theming classes ----
  const bg = isDark ? 'bg-neutral-950' : 'bg-gray-50';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-neutral-900' : 'bg-white';
  const cardBorder = isDark ? 'border-neutral-800' : 'border-gray-200';
  const inputBg = isDark ? 'bg-neutral-950' : 'bg-gray-50';
  const inputBorder = isDark ? 'border-neutral-800' : 'border-gray-300';
  const metricBg = isDark ? 'bg-neutral-950' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bg} ${text} p-8 font-sans`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              AI Chatbot Ads
            </h1>
            <p className={`${subtext} mt-1`}>
              Welcome, {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${cardBorder} ${cardBg} transition-colors hover:opacity-80`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
            <button
              onClick={() => signOut()}
              className={`text-sm font-medium px-4 py-2 rounded-lg border ${cardBorder} ${cardBg} transition-colors hover:opacity-80`}
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form + Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ad Form */}
            <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6 shadow-xl`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Campaign' : 'Create New Ad'}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className={`text-sm ${subtext} hover:opacity-80`}>Cancel</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className={`block text-sm font-medium ${subtext} mb-1`}>Image</label>
                  <div className={`border-2 border-dashed ${inputBorder} rounded-lg p-4 text-center transition-colors hover:border-blue-500`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <div className={`text-sm ${subtext}`}>
                        {uploading ? 'Uploading...' : 'Click to upload an image'}
                      </div>
                      <div className={`text-xs ${subtext} mt-1`}>JPEG, PNG, GIF, WebP (max 5MB)</div>
                    </label>
                  </div>
                  <div className="mt-2 text-xs text-center text-neutral-500">— or paste a URL —</div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 mt-1 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${subtext} mb-1`}>Ad Copy</label>
                  <textarea
                    required
                    value={formData.quote}
                    onChange={e => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Upgrade your workflow today."
                    rows={2}
                    className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${subtext} mb-1`}>Destination Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium ${subtext} mb-1`}>Target</label>
                    <select
                      value={formData.targetChatbot}
                      onChange={e => setFormData({ ...formData, targetChatbot: e.target.value })}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="all">All Chatbots</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${subtext} mb-1`}>Priority</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium ${subtext} mb-1`}>Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${subtext} mb-1`}>End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-4 py-2 ${text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
                >
                  {editingId ? 'Save Changes' : 'Launch Ad'}
                </button>
              </form>
            </div>

            {/* Ad Preview Simulator */}
            {(formData.imageUrl || formData.quote) && (
              <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6 shadow-xl`}>
                <h3 className={`text-sm font-semibold ${subtext} uppercase tracking-wide mb-4`}>Live Preview</h3>
                <div className="relative">
                  {/* Simulated extension overlay */}
                  <div
                    style={{
                      width: '300px',
                      background: isDark ? 'rgba(30, 30, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.5)'
                        : '0 10px 30px rgba(0,0,0,0.1)',
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      margin: '0 auto',
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.5px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      <span>Sponsored</span>
                      <span style={{ cursor: 'pointer', opacity: 0.6 }}>✕</span>
                    </div>
                    {/* Content */}
                    <div style={{ padding: '12px' }}>
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '140px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      {formData.quote && (
                        <p
                          style={{
                            fontSize: '14px',
                            lineHeight: 1.5,
                            color: isDark ? '#f3f4f6' : '#374151',
                            fontWeight: 500,
                            margin: formData.imageUrl ? '12px 0 0' : '0',
                          }}
                        >
                          {formData.quote}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${subtext} text-center mt-3`}>
                    This is how your ad will appear on AI chatbots
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Campaigns */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Your Campaigns</h2>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className={`h-48 ${cardBg} rounded-2xl`}></div>
                <div className={`h-48 ${cardBg} rounded-2xl`}></div>
              </div>
            ) : ads.length === 0 ? (
              <div className={`${cardBg} border ${cardBorder} border-dashed rounded-2xl p-12 text-center`}>
                <p className={subtext}>No campaigns yet. Create your first ad to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad) => {
                  const ctr = ad.totalViews > 0 ? ((ad.totalClicks / ad.totalViews) * 100).toFixed(2) : '0.00';

                  return (
                    <div key={ad.id} className={`${cardBg} border ${ad.isActive ? cardBorder : `${cardBorder} opacity-60`} rounded-2xl overflow-hidden shadow-lg group transition-all`}>
                      {/* Image */}
                      <div className="h-40 overflow-hidden relative">
                        <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium border ${ad.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : `${isDark ? 'bg-neutral-800/80 text-neutral-400 border-neutral-700' : 'bg-gray-200 text-gray-500 border-gray-300'}`}`}>
                            {ad.isActive ? 'Active' : 'Paused'}
                          </div>
                          <div className={`${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/80 border-gray-200 text-gray-700'} backdrop-blur-md px-2 py-1 rounded text-xs font-medium border`}>
                            {ad.targetChatbot === 'all' ? 'All Bots' : ad.targetChatbot}
                          </div>
                          {ad.priority > 1 && (
                            <div className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-2 py-1 rounded text-xs font-medium border">
                              P{ad.priority}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`p-5 border-b ${cardBorder}`}>
                        <p className={`${isDark ? 'text-neutral-200' : 'text-gray-800'} font-medium leading-relaxed mb-2`}>
                          &quot;{ad.quote}&quot;
                        </p>
                        <a href={ad.link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 truncate block mb-3">
                          {ad.link || 'No link'}
                        </a>

                        {/* Schedule info */}
                        {(ad.startDate || ad.endDate) && (
                          <div className={`text-xs ${subtext} mb-3 flex gap-3`}>
                            {ad.startDate && <span>📅 Start: {new Date(ad.startDate).toLocaleDateString()}</span>}
                            {ad.endDate && <span>🏁 End: {new Date(ad.endDate).toLocaleDateString()}</span>}
                          </div>
                        )}

                        {/* Metrics */}
                        <div className={`grid grid-cols-3 gap-2 py-3 ${metricBg} rounded-lg px-4 border ${cardBorder}`}>
                          <div className="text-center">
                            <div className={`text-xs ${subtext} mb-1`}>Views</div>
                            <div className="font-semibold">{ad.totalViews.toLocaleString()}</div>
                          </div>
                          <div className={`text-center border-l ${cardBorder}`}>
                            <div className={`text-xs ${subtext} mb-1`}>Clicks</div>
                            <div className="font-semibold">{ad.totalClicks.toLocaleString()}</div>
                          </div>
                          <div className={`text-center border-l ${cardBorder}`}>
                            <div className={`text-xs ${subtext} mb-1`}>CTR</div>
                            <div className="font-semibold text-emerald-400">{ctr}%</div>
                          </div>
                        </div>

                        {/* Analytics Chart Toggle */}
                        <button
                          onClick={() => fetchAnalytics(ad.id)}
                          className={`w-full mt-3 text-sm font-medium py-2 rounded-lg border ${cardBorder} ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          {expandedAnalytics === ad.id ? 'Hide Analytics' : '📊 View Analytics'}
                        </button>

                        {/* Analytics Chart */}
                        {expandedAnalytics === ad.id && (
                          <div className={`mt-4 p-3 rounded-lg border ${cardBorder} ${metricBg}`}>
                            {chartLoading ? (
                              <div className="h-[200px] flex items-center justify-center text-sm opacity-50">
                                Loading chart...
                              </div>
                            ) : (
                              <AnalyticsChart data={chartData} theme={theme} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className={`${cardBg} px-5 py-3 flex justify-between items-center`}>
                        <button
                          onClick={() => handleToggleStatus(ad)}
                          className={`text-sm font-medium ${ad.isActive ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                        >
                          {ad.isActive ? 'Pause' : 'Resume'}
                        </button>
                        <div className="flex gap-4">
                          <button onClick={() => startEdit(ad)} className={`text-sm font-medium ${subtext} hover:opacity-80`}>Edit</button>
                          <button onClick={() => handleDelete(ad.id)} className="text-sm font-medium text-red-500 hover:text-red-400">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
