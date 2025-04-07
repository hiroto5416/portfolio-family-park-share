// /app/api/photo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('===== 写真取得API開始 =====');
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const width = searchParams.get('width');

    console.log('写真取得リクエスト受信:', {
      reference,
      requestedWidth: width,
    });

    if (!reference) {
      console.error('バリデーションエラー: 写真参照IDが指定されていません');
      return NextResponse.json({ error: '写真参照IDが必要です' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('環境変数エラー: Google APIキーが設定されていません');
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const maxWidth = width ? Math.min(Number(width), 1600) : 400;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${reference}&key=${apiKey}`;

    console.log('Google Places Photo API リクエスト開始:', {
      reference: reference.substring(0, 10) + '...',
      maxWidth,
    });

    const response = await fetch(photoUrl);

    if (!response.ok) {
      console.error('Google Photo API エラー:', {
        status: response.status,
        statusText: response.statusText,
        reference: reference.substring(0, 10) + '...',
        maxWidth,
      });
      return NextResponse.json(
        {
          error: '写真の取得に失敗しました',
          details: `APIレスポンスエラー: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    console.log('写真取得成功:', {
      contentType,
      sizeKB: Math.round(imageBuffer.byteLength / 1024),
      reference: reference.substring(0, 10) + '...',
    });

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('写真取得エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
    });
    return NextResponse.json(
      {
        error: '写真の取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  } finally {
    console.log('===== 写真取得API終了 =====');
  }
}
