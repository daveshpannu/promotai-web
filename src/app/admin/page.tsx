import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import React from "react";
import { RevealStagger } from "@/components/Reveal";
import { AdminFloatingAssets } from "@/components/FloatingAssets";

export default async function AdminDashboard() {
  const session = await auth();

  // Strict server-side check for the isAdmin flag
  if (!(session?.user as any)?.isAdmin) {
    redirect("/");
  }

  // Fetch all users and all of their ad data
  const users = await prisma.user.findMany({
    include: {
      ads: true,
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
      ads: user.ads,
    };
  });

  return (
    <div className="min-h-[100dvh] bg-riso-blue font-sans p-6 md:p-12 text-ink-black selection:bg-riso-coral selection:text-ink-black overflow-x-hidden relative">
      
      <div className="absolute inset-0 bg-halftone opacity-40 mix-blend-overlay pointer-events-none"></div>
      <AdminFloatingAssets />

      <div className="max-w-[1400px] mx-auto space-y-12 mt-6 relative z-10">
        
        <RevealStagger delay={0}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[6px] border-ink-black pb-8 bg-paper-cream p-10 shadow-[16px_16px_0_0_rgba(0,0,0,1)] transform -rotate-1">
            <div>
              <h1 className="font-display font-black text-6xl md:text-8xl text-ink-black leading-none tracking-tighter uppercase drop-shadow-sm">Admin Control</h1>
              <p className="text-ink-black mt-4 font-bold text-lg bg-riso-coral border-[3px] border-ink-black px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] inline-block transform rotate-2">
                Captain's Global Telemetry
              </p>
            </div>
            <div className="flex gap-4 mt-8 md:mt-0">
              <Link href="/" className="interactive-lift px-8 py-4 border-[3px] border-ink-black bg-paper-cream text-ink-black font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                Back to Land
              </Link>
            </div>
          </div>
        </RevealStagger>

        {/* Global Stats Bento */}
        <RevealStagger delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-[4px] border-ink-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] transform rotate-1">
            <div className="bg-paper-cream p-8 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[4px] border-ink-black">
              <div className="text-ink-muted font-black text-sm uppercase tracking-widest mb-4">Total Accounts</div>
              <div className="text-6xl font-display font-black text-ink-black">{globalStats.totalUsers}</div>
            </div>
            <div className="bg-paper-dim p-8 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[4px] border-ink-black">
              <div className="text-ink-muted font-black text-sm uppercase tracking-widest mb-4">Live Payloads</div>
              <div className="text-6xl font-display font-black text-ink-black">{globalStats.totalAds}</div>
            </div>
            <div className="bg-riso-coral p-8 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[4px] border-ink-black">
              <div className="text-ink-black font-black text-sm uppercase tracking-widest mb-4">Impressions</div>
              <div className="text-6xl font-display font-black text-ink-black">{globalStats.totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-paper-cream p-8 flex flex-col justify-between">
              <div className="text-ink-muted font-black text-sm uppercase tracking-widest mb-4">Engagements</div>
              <div className="text-6xl font-display font-black text-ink-black">{globalStats.totalClicks.toLocaleString()}</div>
            </div>
          </div>
        </RevealStagger>

        {/* User Table */}
        <RevealStagger delay={0.2}>
          <div className="border-[4px] border-ink-black bg-paper-cream shadow-[16px_16px_0_0_rgba(0,0,0,1)] transform -rotate-[0.5deg]">
            <div className="px-10 py-8 border-b-[4px] border-ink-black bg-paper-dim flex justify-between items-center">
              <h2 className="text-4xl font-display font-black text-ink-black uppercase tracking-tighter">Advertiser Nodes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-ink-black">
                  <tr>
                    <th className="px-10 py-5 font-black text-sm uppercase tracking-widest text-paper-cream">Identity</th>
                    <th className="px-10 py-5 font-black text-sm uppercase tracking-widest text-paper-cream">Origin Date</th>
                    <th className="px-10 py-5 font-black text-sm uppercase tracking-widest text-paper-cream">Payloads (Live/All)</th>
                    <th className="px-10 py-5 font-black text-sm uppercase tracking-widest text-paper-cream">Volume</th>
                    <th className="px-10 py-5 font-black text-sm uppercase tracking-widest text-paper-cream">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[3px] divide-ink-black">
                  {userStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-ink-muted font-black text-xl uppercase tracking-widest">
                        Zero nodes detected.
                      </td>
                    </tr>
                  ) : (
                    userStats.map((user, idx) => (
                      <React.Fragment key={user.id}>
                        {/* User Summary Row */}
                        <tr className={`transition-colors group ${idx % 2 === 0 ? 'bg-paper-cream' : 'bg-paper-dim'}`}>
                          <td className="px-10 py-8 border-r-[3px] border-ink-black">
                            <div className="text-ink-black font-black text-xl mb-1">{user.name}</div>
                            <div className="text-base text-ink-muted font-bold">{user.email}</div>
                            <div className="text-xs text-ink-muted font-black mt-3 uppercase border-2 border-ink-muted/30 inline-block px-2 py-1">ID: {user.id.substring(0, 8)}...</div>
                          </td>
                          <td className="px-10 py-8 text-ink-black font-bold text-lg border-r-[3px] border-ink-black">{user.createdAt}</td>
                          <td className="px-10 py-8 border-r-[3px] border-ink-black">
                            <div className="inline-flex items-center gap-3 px-4 py-2 border-[3px] border-ink-black text-lg font-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                              <span className={`w-3 h-3 border-2 border-ink-black ${user.activeAds > 0 ? 'bg-riso-coral' : 'bg-paper-dim'}`}></span>
                              <span className="text-ink-black">{user.activeAds}</span>
                              <span className="text-ink-muted">/ {user.totalAds}</span>
                            </div>
                          </td>
                          <td className="px-10 py-8 font-black text-2xl text-ink-black border-r-[3px] border-ink-black">{user.totalViews.toLocaleString()}</td>
                          <td className="px-10 py-8 font-black text-2xl text-ink-black">{user.totalClicks.toLocaleString()}</td>
                        </tr>
                        
                        {/* Ads Detail Sub-row */}
                        {user.ads.length > 0 && (
                          <tr className="bg-riso-blue/10">
                            <td colSpan={5} className="px-10 py-10 border-b-[4px] border-ink-black">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.ads.map((ad, i) => (
                                  <div key={ad.id} className={`border-[4px] border-ink-black p-6 bg-paper-cream flex flex-col justify-between shadow-[8px_8px_0_0_rgba(0,0,0,1)] transform ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                                    <div>
                                      <div className="flex justify-between items-start mb-6">
                                        <span className="text-ink-black font-bold text-lg line-clamp-2 pr-4 leading-relaxed flex-1">"{ad.quote}"</span>
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 border-[2px] border-ink-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${ad.isActive ? 'bg-riso-coral text-ink-black' : 'bg-paper-dim text-ink-muted'}`}>
                                          {ad.isActive ? 'Live' : 'Halted'}
                                        </span>
                                      </div>
                                      <div className="text-xs font-bold text-riso-blue truncate mb-6 bg-white border-2 border-ink-black p-2">
                                        {ad.link}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t-[3px] border-ink-black border-dashed">
                                      <div className="flex gap-4 font-black text-sm text-ink-black tracking-widest uppercase">
                                        <span title="Views">V: {ad.totalViews.toLocaleString()}</span>
                                        <span title="Clicks">C: {ad.totalClicks.toLocaleString()}</span>
                                      </div>
                                      <div className="text-xs font-black uppercase text-paper-cream bg-ink-black px-2 py-1">
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
        </RevealStagger>
      </div>
    </div>
  );
}
