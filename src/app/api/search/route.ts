import { NextResponse } from 'next/server';
import { GooglePlace } from '@/types/park';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!query) {
      return NextResponse.json({ error: '検索クエリが必要です' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&type=park&key=${apiKey}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: data.error_message || '検索に失敗しました' },
        { status: 500 }
      );
    }

    // 検索結果を変換
    const parks = data.results.map((place: GooglePlace) => ({
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

    return NextResponse.json({ results: parks });
  } catch (error) {
    console.error('API検索エラー:', error);
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 });
  }
}
