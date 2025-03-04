// /app/api/photo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: '写真参照IDが必要です' }, { status: 400 });
  }

  try {
    // 重要: Google Places Photo APIでは「photoreference」が正しいパラメータ名
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google APIキーが設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }
    
    // 正しいパラメータ名でURLを構築
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${apiKey}`;
    
    // リクエスト
    const response = await fetch(photoUrl);
    
    // エラーチェック
    if (!response.ok) {
      console.error(`Google Photo API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: '写真の取得に失敗しました' }, { status: response.status });
    }
    
    // 画像データを取得
    const imageBuffer = await response.arrayBuffer();
    
    // 元のレスポンスからContent-Typeを取得
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    // 画像データを返す
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