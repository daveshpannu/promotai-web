import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    // Get events for the last 30 days, grouped by day
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await prisma.adEvent.findMany({
      where: {
        adId: id,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group events by day and action
    const dailyData: Record<string, { date: string; views: number; clicks: number }> = {};

    // Pre-fill the last 30 days with zeros
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyData[key] = { date: key, views: 0, clicks: 0 };
    }

    for (const event of events) {
      const day = event.createdAt.toISOString().split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = { date: day, views: 0, clicks: 0 };
      }
      if (event.action === 'view') {
        dailyData[day].views++;
      } else if (event.action === 'click') {
        dailyData[day].clicks++;
      }
    }

    const chartData = Object.values(dailyData).sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    return NextResponse.json({ chartData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
