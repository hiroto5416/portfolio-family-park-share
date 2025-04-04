// /app/api/photo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const width = searchParams.get('width');

  if (!reference) {
    return NextResponse.json({ error: '写真参照IDが必要です' }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google APIキーが設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const maxWidth = width ? Math.min(Number(width), 1600) : 400;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${reference}&key=${apiKey}`;

    const response = await fetch(photoUrl);

    if (!response.ok) {
      console.error(`Google Photo API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: '写真の取得に失敗しました' }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json({ error: '写真の取得に失敗しました' }, { status: 500 });
  }
}
