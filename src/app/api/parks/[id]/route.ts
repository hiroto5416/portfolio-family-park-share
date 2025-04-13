import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// RouteContext型の定義
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * 公園の詳細情報を取得するAPI
 * @param request リクエスト
 * @param context パラメータ（公園IDを含む）
 * @returns 公園の詳細情報
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Promiseからパラメータを取得
    const p = await context.params;
    const placeId = p.id;

    // デバッグ用にパラメータを確認

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is not set');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      return NextResponse.json({ error: '公園が見つかりませんでした' }, { status: 404 });
    }

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
    console.error('Error in parks API:', error);
    return NextResponse.json({ error: '公園情報の取得に失敗しました' }, { status: 500 });
  }
}
