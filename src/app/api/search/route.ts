import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!query) {
      return NextResponse.json({ error: '検索クエリが必要です' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=park&key=${apiKey}&language=ja`;

    console.log('Google Places APIリクエスト:', url); // APIリクエストの確認

    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Places APIレスポンス:', data); // APIレスポンスの確認

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: data.error_message || '検索に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API検索エラー:', error);
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 });
  }
}
