import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!id || !action || (action !== 'view' && action !== 'click')) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400, headers });
    }

    // Increment counter on the Ad
    if (action === 'view') {
      await prisma.ad.update({
        where: { id },
        data: { totalViews: { increment: 1 } },
      });
    } else if (action === 'click') {
      await prisma.ad.update({
        where: { id },
        data: { totalClicks: { increment: 1 } },
      });
    }

    // Also create a time-series event for analytics charts
    await prisma.adEvent.create({
      data: {
        adId: id,
        action,
      },
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new NextResponse(null, { status: 204, headers });
}
