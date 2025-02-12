import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=35.6812362,139.7671248&` + // 東京駅の座標
        `radius=1000&` +
        `type=park&` +
        `language=ja&` + // 日本語の結果を取得
        `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
