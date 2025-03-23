import { Park } from '@/types/park';
import { NextResponse } from 'next/server';

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

    const parks = data.results.map((result: Park) => ({
      place_id: result.place_id,
      name: result.name,
      vicinity: result.vicinity,
      location: result.geometry.location,
      photos:
        result.photos?.map((photo, index) => ({
          id: `${result.place_id}-photo-${index}`,
          photo_reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })) || [],
    }));

    return NextResponse.json({ parks: parks.slice(0, 5) });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
