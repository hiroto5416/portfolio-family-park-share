import { NextResponse } from 'next/server';
import { GooglePlace } from '@/types/park';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: '位置情報が必要です' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}&` +
        `radius=5000&` +
        `type=park&` +
        `language=ja&` +
        `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

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

    return NextResponse.json({ parks: parks.slice(0, 5) });
  } catch (error) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `レビューの取得に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
