import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import React from "react";
import { RevealStagger } from "@/components/Reveal";

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
    <div className="min-h-[100dvh] bg-lacquer-black font-sans p-6 md:p-12 text-text-warm selection:bg-kinpaku-gold selection:text-lacquer-black">
      <div className="max-w-[1400px] mx-auto space-y-12 mt-6">
        
        <RevealStagger delay={0}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gold-hairline pb-8">
            <div>
              <h1 className="font-display text-5xl md:text-7xl text-champagne leading-none tracking-tight">Oversight</h1>
              <p className="text-text-muted mt-4 font-mono text-xs uppercase tracking-widest">Global Network Telemetry</p>
            </div>
            <div className="flex gap-4 mt-8 md:mt-0">
              <Link href="/" className="px-6 py-3 border border-gold-hairline hover:border-kinpaku-gold bg-raised-lacquer text-text-muted hover:text-kinpaku-gold transition-colors font-mono uppercase tracking-widest text-xs">
                Exit Protocol
              </Link>
            </div>
          </div>
        </RevealStagger>

        {/* Global Stats Bento */}
        <RevealStagger delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gold-hairline border border-gold-hairline">
            <div className="bg-raised-lacquer p-8 flex flex-col justify-between">
              <div className="text-text-faint font-mono text-[10px] uppercase tracking-widest mb-4">Total Accounts</div>
              <div className="text-5xl font-display text-champagne">{globalStats.totalUsers}</div>
            </div>
            <div className="bg-raised-lacquer p-8 flex flex-col justify-between">
              <div className="text-text-faint font-mono text-[10px] uppercase tracking-widest mb-4">Live Payloads</div>
              <div className="text-5xl font-display text-champagne">{globalStats.totalAds}</div>
            </div>
            <div className="bg-raised-lacquer p-8 flex flex-col justify-between">
              <div className="text-text-faint font-mono text-[10px] uppercase tracking-widest mb-4">Impressions</div>
              <div className="text-5xl font-display text-kinpaku-gold">{globalStats.totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-raised-lacquer p-8 flex flex-col justify-between">
              <div className="text-text-faint font-mono text-[10px] uppercase tracking-widest mb-4">Engagements</div>
              <div className="text-5xl font-display text-patina">{globalStats.totalClicks.toLocaleString()}</div>
            </div>
          </div>
        </RevealStagger>

        {/* User Table */}
        <RevealStagger delay={0.2}>
          <div className="border border-gold-hairline bg-raised-lacquer">
            <div className="px-8 py-6 border-b border-gold-hairline bg-lacquer-deep">
              <h2 className="text-2xl font-display text-champagne">Advertiser Nodes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-lacquer-black border-b border-gold-hairline">
                  <tr>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">Identity</th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">Origin Date</th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">Payloads (Live/All)</th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">Volume</th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-hairline">
                  {userStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center text-text-faint font-mono text-sm uppercase tracking-widest">
                        Zero nodes detected.
                      </td>
                    </tr>
                  ) : (
                    userStats.map((user) => (
                      <React.Fragment key={user.id}>
                        {/* User Summary Row */}
                        <tr className="hover:bg-lacquer-black transition-colors group">
                          <td className="px-8 py-6">
                            <div className="text-champagne mb-1">{user.name}</div>
                            <div className="text-sm text-text-muted">{user.email}</div>
                            <div className="text-[10px] text-text-faint font-mono mt-2 uppercase">ID: {user.id.substring(0, 8)}...</div>
                          </td>
                          <td className="px-8 py-6 text-text-muted text-sm">{user.createdAt}</td>
                          <td className="px-8 py-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold-hairline text-xs font-mono">
                              <span className={`w-1.5 h-1.5 ${user.activeAds > 0 ? 'bg-kinpaku-gold' : 'bg-graphite'}`}></span>
                              <span className="text-champagne">{user.activeAds}</span>
                              <span className="text-text-faint">/ {user.totalAds}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-mono text-champagne">{user.totalViews.toLocaleString()}</td>
                          <td className="px-8 py-6 font-mono text-champagne">{user.totalClicks.toLocaleString()}</td>
                        </tr>
                        
                        {/* Ads Detail Sub-row */}
                        {user.ads.length > 0 && (
                          <tr className="bg-lacquer-deep">
                            <td colSpan={5} className="px-8 py-8 border-b-2 border-gold-hairline">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold-hairline border border-gold-hairline">
                                {user.ads.map(ad => (
                                  <div key={ad.id} className="p-6 bg-raised-lacquer flex flex-col justify-between">
                                    <div>
                                      <div className="flex justify-between items-start mb-4">
                                        <span className="text-champagne text-sm line-clamp-2 pr-4 leading-relaxed flex-1">"{ad.quote}"</span>
                                        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 border ${ad.isActive ? 'border-kinpaku-gold text-kinpaku-gold' : 'border-text-faint text-text-faint'}`}>
                                          {ad.isActive ? 'Live' : 'Halted'}
                                        </span>
                                      </div>
                                      <div className="text-[10px] font-mono text-patina truncate mb-4">
                                        {ad.link}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                      <div className="flex gap-4 font-mono text-[10px] text-text-muted tracking-widest uppercase">
                                        <span title="Views">V: {ad.totalViews.toLocaleString()}</span>
                                        <span title="Clicks">C: {ad.totalClicks.toLocaleString()}</span>
                                      </div>
                                      <div className="text-[10px] font-mono uppercase text-text-faint tracking-widest">
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
