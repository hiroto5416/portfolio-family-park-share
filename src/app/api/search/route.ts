import { NextResponse } from 'next/server';
import { GooglePlace } from '@/types/park';

export async function GET(request: Request) {
  try {
    console.log('公園検索API開始');

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    console.log('検索パラメータ:', { query });

    if (!query) {
      console.error('検索クエリが指定されていません');
      return NextResponse.json({ error: '検索クエリが必要です' }, { status: 400 });
    }

    if (!apiKey) {
      console.error('Google Maps APIキーが設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&type=park&key=${apiKey}&language=ja`;

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

    // データの存在確認を追加
    if (!data.results || !Array.isArray(data.results)) {
      console.error('不正なレスポンス形式:', data);
      return NextResponse.json({ parks: [], total: 0 }, { status: 200 });
    }

    // 検索結果を変換
    const parks = data.results
      .filter((place: GooglePlace) => place && place.place_id)
      .map((place: GooglePlace) => ({
        place_id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        formatted_address: place.formatted_address || place.vicinity,
        photos: place.photos?.map((photo) => ({
          photo_reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })),
      }));

    console.log(`検索結果: ${parks.length}件の公園が見つかりました`);

    return NextResponse.json({ results: parks });
  } catch (error) {
    console.error('公園検索エラー:', {
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
