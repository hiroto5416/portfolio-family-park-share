import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // デバッグ用にパラメータを確認
    console.log('Received request for park ID:', params.id);

    const placeId = params.id;
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

    return NextResponse.json({
      park: {
        id: data.result.place_id,
        name: data.result.name,
        address: data.result.formatted_address,
        photos: data.result.photos,
        hours: data.result.opening_hours?.weekday_text || '24時間',
        facilities: [], // 後で実装
      },
    });
  } catch (error) {
    console.error('Error in parks API:', error);
    return NextResponse.json({ error: '公園情報の取得に失敗しました' }, { status: 500 });
  }
}
