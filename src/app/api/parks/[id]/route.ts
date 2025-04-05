import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// RouteContext型の定義
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Promiseからパラメータを取得
    const p = await context.params;
    const placeId = p.id;

    // デバッグ用にパラメータを確認
    console.log('Received request for park ID:', placeId);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is not set');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ja`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Places API response:', data);

    if (!data.result) {
      return NextResponse.json({ error: '公園が見つかりませんでした' }, { status: 404 });
    }

    console.log('Business status from API:', data.result.business_status);
    return NextResponse.json({
      park: {
        id: data.result.place_id,
        name: data.result.name,
        address: data.result.formatted_address,
        photos: data.result.photos,
        hours: data.result.opening_hours?.weekday_text || '24時間',
        types: data.result.types || [],
        businessStatus:
          data.result.business_status || data.result.operational_status || 'OPERATIONAL',
        facilities: [], // 後で実装
      },
    });
  } catch (error) {
    console.error('公園情報取得エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `公園情報の取得に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
