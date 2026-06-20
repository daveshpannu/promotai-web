import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import React from "react";

export default async function AdminDashboard() {
  const session = await auth();

  // Strict server-side check for the isAdmin flag
  if (!(session?.user as any)?.isAdmin) {
    redirect("/");
  }

  // Fetch all users and all of their ad data
  const users = await prisma.user.findMany({
    include: {
      ads: true, // Fetch all fields for the ads so we can see what they are running
    },
    orderBy: { createdAt: "desc" },
  });

  const globalStats = {
    totalUsers: users.length,
    totalAds: 0,
    totalViews: 0,
    totalClicks: 0,
  };

  const userStats = users.map((user) => {
    const totalAds = user.ads.length;
    const activeAds = user.ads.filter((a) => a.isActive).length;
    const totalViews = user.ads.reduce((sum, ad) => sum + ad.totalViews, 0);
    const totalClicks = user.ads.reduce((sum, ad) => sum + ad.totalClicks, 0);

    globalStats.totalAds += totalAds;
    globalStats.totalViews += totalViews;
    globalStats.totalClicks += totalClicks;

    return {
      id: user.id,
      email: user.email,
      name: user.name || "N/A",
      createdAt: user.createdAt.toLocaleDateString(),
      totalAds,
      activeAds,
      totalViews,
      totalClicks,
      ads: user.ads, // Pass the full ad objects to the UI
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcfce7] via-[#f0fdf4] to-[#ccfbf1] text-slate-800 font-sans p-6">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      <div className="absolute top-[-10%] -left-[10%] w-[500px] h-[500px] bg-[#c4f051] rounded-full filter blur-[150px] opacity-60 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 mt-12">
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Superuser access only. Monitoring all platform activity.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-5 py-2.5 bg-white/60 border border-white/80 rounded-xl font-bold text-slate-700 hover:bg-white transition-colors shadow-sm">
              View Live Site
            </Link>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/50 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
            <div className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Total Accounts</div>
            <div className="text-4xl font-extrabold text-slate-900">{globalStats.totalUsers}</div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
            <div className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Total Ads Created</div>
            <div className="text-4xl font-extrabold text-slate-900">{globalStats.totalAds}</div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
            <div className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">Total Views Served</div>
            <div className="text-4xl font-extrabold text-emerald-700">{globalStats.totalViews.toLocaleString()}</div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
            <div className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Total Clicks</div>
            <div className="text-4xl font-extrabold text-blue-700">{globalStats.totalClicks.toLocaleString()}</div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/50 bg-white/20">
            <h2 className="text-xl font-bold text-slate-800">Advertiser Directory & Campaigns</h2>
            <p className="text-sm text-slate-500 font-medium">Reviewing all active and paused ad units running on the network.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/40 border-b border-white/50">
                <tr>
                  <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider text-sm">Account</th>
                  <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider text-sm">Joined</th>
                  <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider text-sm">Ads (Active/Total)</th>
                  <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider text-sm">Total Views</th>
                  <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider text-sm">Total Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {userStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">
                      No advertisers have signed up yet.
                    </td>
                  </tr>
                ) : (
                  userStats.map((user) => (
                    <React.Fragment key={user.id}>
                      {/* User Summary Row */}
                      <tr className="hover:bg-white/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                          <div className="text-xs text-slate-400 font-mono mt-1">ID: {user.id}</div>
                        </td>
                        <td className="px-8 py-5 text-slate-600 font-medium">{user.createdAt}</td>
                        <td className="px-8 py-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white shadow-sm font-bold text-sm">
                            <span className={`w-2 h-2 rounded-full ${user.activeAds > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            {user.activeAds} / {user.totalAds}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-mono text-slate-700">{user.totalViews.toLocaleString()}</td>
                        <td className="px-8 py-5 font-mono text-slate-700">{user.totalClicks.toLocaleString()}</td>
                      </tr>
                      
                      {/* Ads Detail Sub-row */}
                      {user.ads.length > 0 && (
                        <tr className="bg-white/10">
                          <td colSpan={5} className="px-8 py-6 border-b-2 border-white/30">
                            <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Campaign Details for {user.name}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {user.ads.map(ad => (
                                <div key={ad.id} className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${ad.isActive ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50/70'}`}>
                                  <div>
                                    <div className="flex justify-between items-start mb-3">
                                      <span className="font-semibold text-slate-800 text-sm line-clamp-2 italic pr-2">"{ad.quote}"</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ad.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {ad.isActive ? 'ACTIVE' : 'PAUSED'}
                                      </span>
                                    </div>
                                    <div className="text-xs font-mono text-blue-600 truncate mb-3 bg-white/60 p-1.5 rounded border border-white/50">
                                      {ad.link}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-200/50">
                                    <div className="flex gap-4">
                                      <span className="flex items-center gap-1.5" title="Views">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                        {ad.totalViews.toLocaleString()}
                                      </span>
                                      <span className="flex items-center gap-1.5" title="Clicks">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                                        {ad.totalClicks.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold bg-slate-200/50 px-1.5 py-0.5 rounded">
                                      {ad.targetChatbot}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
