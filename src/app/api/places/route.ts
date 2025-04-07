import { NextResponse } from 'next/server';
import { GooglePlace } from '@/types/park';

export async function GET(request: Request) {
  console.log('近隣公園検索API開始');

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  console.log('検索パラメータ:', { lat, lng });

  if (!lat || !lng) {
    console.error('必須パラメータ不足:', { lat, lng });
    return NextResponse.json({ error: '位置情報が必要です' }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps APIキーが設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}&` +
      `radius=5000&` +
      `type=park&` +
      `language=ja&` +
      `key=${apiKey}`;

    console.log('Google Places API リクエスト開始');
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places APIエラー:', {
        status: data.status,
        error_message: data.error_message,
      });
      return NextResponse.json(
        { error: data.error_message || '検索に失敗しました' },
        { status: 500 }
      );
    }

    const parks = data.results.map((result: GooglePlace) => ({
      place_id: result.place_id,
      name: result.name,
      vicinity: result.vicinity,
      formatted_address: result.formatted_address || result.vicinity,
      location: result.geometry?.location || { lat: 0, lng: 0 },
      photos:
        result.photos?.map((photo) => ({
          id: `${result.place_id}-photo-${photo.photo_reference}`,
          photo_reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })) || [],
    }));

    console.log(`検索結果: ${parks.length}件の公園が見つかりました`);

    return NextResponse.json({ parks: parks.slice(0, 5) });
  } catch (error) {
    console.error('近隣公園検索エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: '検索中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
