import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ ads });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, quote, link, targetChatbot } = body;

    if (!imageUrl || !quote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAd = await prisma.ad.create({
      data: {
        imageUrl,
        quote,
        link: link || '#',
        targetChatbot: targetChatbot || 'all',
      },
    });

    return NextResponse.json({ ad: newAd }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}
