import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const { searchParams } = new URL(request.url);
  const chatbot = searchParams.get('chatbot') || 'unknown';
  const now = new Date();

  try {
    const ads = await prisma.ad.findMany({
      where: {
        isActive: true,
        OR: [
          { targetChatbot: 'all' },
          { targetChatbot: chatbot }
        ]
      }
    });

    // Filter by schedule
    const scheduledAds = ads.filter(ad => {
      if (ad.startDate && new Date(ad.startDate) > now) return false;
      if (ad.endDate && new Date(ad.endDate) < now) return false;
      return true;
    });
    
    if (scheduledAds.length === 0) {
      return NextResponse.json({ error: 'No ads available' }, { status: 404, headers });
    }

    // Weighted random selection based on priority
    const totalWeight = scheduledAds.reduce((sum, ad) => sum + (ad.priority || 1), 0);
    let random = Math.random() * totalWeight;
    let selectedAd = scheduledAds[0];

    for (const ad of scheduledAds) {
      random -= (ad.priority || 1);
      if (random <= 0) {
        selectedAd = ad;
        break;
      }
    }

    return NextResponse.json({ ad: selectedAd }, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new NextResponse(null, { status: 204, headers });
}
