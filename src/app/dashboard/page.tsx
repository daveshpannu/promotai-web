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
  const [viewMode, setViewMode] = useState<'advertiser' | 'viewer'>('advertiser');
  const [formData, setFormData] = useState({
    imageUrl: '',
    quote: '',
    link: '',
    targetChatbot: 'all',
    priority: 1,
    startDate: '',
    endDate: '',
  });

  // User Earnings State
  const [walletBalance, setWalletBalance] = useState(1248.50);
  const [todayEarnings, setTodayEarnings] = useState(24.50);
  const [totalImpressions, setTotalImpressions] = useState(163);
  const [upiId, setUpiId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., yourname@oksbi or yourname@paytm)');
      return;
    }
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 50) {
      alert('Minimum cashout threshold is ₹50.00');
      return;
    }
    if (amountNum > walletBalance) {
      alert('Withdrawal amount exceeds your current wallet balance.');
      return;
    }

    setPayoutLoading(true);
    setTimeout(() => {
      setWalletBalance(prev => Number((prev - amountNum).toFixed(2)));
      setPayoutLoading(false);
      setPayoutSuccessMsg(`🎉 Payout of ₹${amountNum.toFixed(2)} successfully sent to ${upiId}! Ref: UPI-${Date.now().toString().slice(-6)}`);
      setTimeout(() => setPayoutSuccessMsg(''), 8000);
    }, 1200);
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session?.user) {
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const roleParam = urlParams?.get('role');
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('promotai_role') : null;

      if (roleParam === 'viewer' || roleParam === 'advertiser') {
        setViewMode(roleParam);
      } else if (storedRole === 'viewer' || storedRole === 'advertiser') {
        setViewMode(storedRole);
      } else {
        setViewMode((session.user as any).role || 'advertiser');
      }
    }
  }, [status, session, router]);

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

  const handleRazorpayPayment = async (packageType: string, amountRupees: number, impressions: number) => {
    try {
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(res => { script.onload = res; });
      }

      const res = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType, amountRupees, impressions }),
      });
      const orderData = await res.json();

      if (!orderData.success) {
        alert('Could not initialize payment order');
        return;
      }

      if (orderData.isSimulated) {
        alert(`🎉 Razorpay Simulation Success!\n\nOrder ID: ${orderData.orderId}\nSuccessfully added ${impressions.toLocaleString()} AI Impressions to your Campaign Budget for ₹${amountRupees}!\n(Rate: ₹25 / 100 Impressions)`);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PromotAI Native Ads',
        description: `${impressions.toLocaleString()} AI Impressions (${packageType})`,
        order_id: orderData.orderId,
        handler: function (response: any) {
          alert(`🎉 Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nAdded ${impressions.toLocaleString()} Impressions to your account!`);
        },
        prefill: {
          name: session?.user?.name || 'Advertiser',
          email: session?.user?.email || 'advertiser@promotai.com',
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed');
    }
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

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${viewMode === 'advertiser' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {viewMode === 'advertiser' ? '📢 Advertiser Mode' : '💰 User Earnings Mode'}
              </span>
            </div>
            <h1 className="font-display font-medium text-4xl md:text-5xl text-gray-900 tracking-tight">
              {viewMode === 'advertiser' ? 'Campaign Deck' : 'Earnings & Wallet Hub'}
            </h1>
            <p className="text-gray-500 mt-2 font-medium text-sm">
              Account: {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === 'advertiser' ? 'viewer' : 'advertiser')}
              className="text-xs font-bold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 text-emerald-800 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              Switch to {viewMode === 'advertiser' ? '💰 User Earnings Hub' : '📢 Campaign Deck'}
            </button>
            <button
              onClick={() => signOut()}
              className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 hover:text-gray-900 transition-all"
            >
              Log Out
            </button>
          </div>
        </motion.header>

        {viewMode === 'advertiser' ? (
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
            className="lg:col-span-8 relative z-10 space-y-8"
          >
            {/* Razorpay Budget Top-Up Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  ⚡ Razorpay Gateway Live
                </div>
                <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight">Add AI Impressions</h3>
                <p className="text-blue-200/80 text-xs md:text-sm font-light">
                  Top up your campaign budget at our disruptive rate of <span className="font-bold text-white">₹25 per 100 verified LLM views</span>.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleRazorpayPayment('Starter Budget', 25, 100)}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all hover:scale-105 shadow-sm text-center"
                >
                  <div className="font-bold text-sm">₹25</div>
                  <div className="text-[10px] text-blue-200">100 Views</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRazorpayPayment('Growth Deck', 250, 1000)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-gray-950 font-bold text-xs transition-all hover:scale-105 shadow-lg shadow-cyan-500/25 text-center"
                >
                  <div className="font-extrabold text-sm text-gray-900">₹250</div>
                  <div className="text-[10px] text-gray-800">1,000 Views 🔥</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRazorpayPayment('Enterprise Pack', 2500, 10000)}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all hover:scale-105 shadow-sm text-center"
                >
                  <div className="font-bold text-sm">₹2,500</div>
                  <div className="text-[10px] text-blue-200">10,000 Views</div>
                </button>
              </div>
            </div>

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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Top Wallet Hero */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-950/10 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 text-3xl">
                    💰
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live Earner Balance</span>
                    </div>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-gray-900 tracking-tight">
                      Developer & User Wallet
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Earn passive income or offset your AI subscriptions while using Antigravity, Claude, ChatGPT & Codex.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode('advertiser')}
                    className="text-xs font-bold bg-white border border-gray-200 hover:border-blue-300 text-blue-700 px-5 py-3 rounded-full shadow-xs hover:shadow-md transition-all"
                  >
                    Switch to Post Ads 📢
                  </button>
                  <a
                    href="/downloads/PromotAI.exe"
                    download="PromotAI.exe"
                    className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    Download Client 📥
                  </a>
                </div>
              </div>

              {/* 4 Core Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Available Balance */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-6 rounded-3xl border border-emerald-200/70 shadow-xs relative overflow-hidden">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Available Balance</div>
                  <div className="text-3xl sm:text-4xl font-display font-medium text-gray-900 tracking-tight">
                    ₹{walletBalance.toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    <span>⚡ Available for instant UPI cashout</span>
                  </div>
                </div>

                {/* Today's Income */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50/60 p-6 rounded-3xl border border-teal-200/70 shadow-xs">
                  <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">Today's Income</div>
                  <div className="text-3xl sm:text-4xl font-display font-medium text-gray-900 tracking-tight">
                    ₹{todayEarnings.toFixed(2)}
                  </div>
                  <div className="text-xs text-teal-600 font-medium mt-2">
                    ▲ +24% over yesterday
                  </div>
                </div>

                {/* Total Impressions */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-3xl border border-blue-200/70 shadow-xs">
                  <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">Verified Ad Views</div>
                  <div className="text-3xl sm:text-4xl font-display font-medium text-gray-900 tracking-tight">
                    {totalImpressions}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-2">
                    ₹0.15 - ₹0.50 per sponsor view
                  </div>
                </div>

                {/* AI Subscription Offset */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50/60 p-6 rounded-3xl border border-purple-200/70 shadow-xs">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">AI Sub Offset</div>
                  <div className="text-3xl sm:text-4xl font-display font-medium text-gray-900 tracking-tight">
                    93.7%
                  </div>
                  <div className="text-xs text-purple-600 font-medium mt-2">
                    Toward free Cursor/Claude Pro
                  </div>
                </div>
              </div>

              {/* Progress Bar for AI Sub Offset */}
              <div className="bg-gray-100/80 rounded-2xl p-4 border border-gray-200/60 mb-8">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>Monthly AI Subscription Offset Progress ($20 / ~₹1,600 Goal)</span>
                  </span>
                  <span className="text-emerald-700 font-bold">₹1,248.50 / ₹1,600.00 (78%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
                </div>
                <div className="text-[11px] text-gray-500 mt-2 flex justify-between">
                  <span>₹351.50 remaining until 100% free AI coding subscription voucher</span>
                  <span className="font-semibold text-emerald-600">Active Tier: Gold Earner</span>
                </div>
              </div>

              {/* Payout Cashout Section */}
              <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-3xl p-6 md:p-8 border border-gray-200/80 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-medium text-xl text-gray-900">
                      ⚡ Request Instant Payout
                    </h3>
                    <p className="text-xs text-gray-500">
                      Transfer your accumulated rupees directly to your bank via UPI. Minimum threshold: ₹50.00.
                    </p>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Instant Payouts Active
                  </span>
                </div>

                {payoutSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-5 text-sm font-medium shadow-xs"
                  >
                    {payoutSuccessMsg}
                  </motion.div>
                )}

                <form onSubmit={handleRequestPayout} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-7 space-y-1.5">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                        UPI ID (VPA)
                      </label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis or 9876543210@paytm"
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 shadow-xs"
                      />
                    </div>

                    <div className="md:col-span-5 space-y-1.5">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Withdraw Amount (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          min="50"
                          max={walletBalance}
                          value={withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Amount Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 mr-1">Quick Select:</span>
                    {['100', '250', '500', '1000'].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(amt)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          withdrawAmount === amt
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(Math.floor(walletBalance).toString())}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    >
                      Max (₹{Math.floor(walletBalance)})
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={payoutLoading || walletBalance < 50}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                  >
                    {payoutLoading ? 'Processing UPI Transfer...' : `Withdraw ₹${Number(withdrawAmount || 0).toFixed(2)} to UPI`}
                  </button>
                </form>
              </div>

              {/* Recent Earnings Activity Ledger */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-medium text-xl text-gray-900">
                    📜 Live Earnings Activity
                  </h3>
                  <span className="text-xs text-gray-400">Auto-refreshed from Extension & Windows App</span>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <div className="divide-y divide-gray-100">
                    {[
                      { source: 'Antigravity IDE', action: 'Multi-step Coding Turn Sponsor', amount: '+₹0.50', time: 'Just now', icon: '🪐' },
                      { source: 'ChatGPT Desktop', action: 'Response Interstitial View', amount: '+₹0.15', time: '14 mins ago', icon: '🤖' },
                      { source: 'Claude Code CLI', action: 'Pre-Execution Tool Sponsor', amount: '+₹0.50', time: '38 mins ago', icon: '⚡' },
                      { source: 'Codex Desktop', action: 'Turn Completion Sponsor Impression', amount: '+₹0.50', time: '1 hour ago', icon: '💻' },
                      { source: 'Gemini Web', action: 'Overlay Sponsor Placement', amount: '+₹0.15', time: '2 hours ago', icon: '✨' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                            <p className="text-xs text-gray-400">{item.source} • {item.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            {item.amount}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">Verified</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
