import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 公園のレビューを取得するAPI
 * @param request リクエスト
 * @param params パラメータ（公園ID）
 * @returns レビューのリスト
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('Fetching reviews for park:', id);

    // 1. 公園IDの確認（place_idからidへの変換）
    const parkResult = await prisma.park.findUnique({
      select: {
        id: true,
      },
      where: {
        place_id: id,
      },
    });

    // 公園が見つからない場合はエラー
    if (!parkResult) {
      console.error('公園が見つかりません:', id);
      return NextResponse.json({ error: '公園が見つかりません' }, { status: 404 });
    }

    console.log('クエリ実行開始...');

    // 2. レビューの取得
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        likesCount: true,
        user: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
      where: {
        parkId: parkResult.id,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    // レスポンスの形式を元のSupabaseレスポースと合わせる
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      content: review.content,
      created_at: review.createdAt.toISOString(),
      likes_count: review.likesCount,
      users: {
        // フロントエンドが users を期待しているため
        name: review.user.name,
      },
      review_images: review.images.map((image) => ({
        image_url: image.imageUrl,
      })),
    }));

    // 成功時はレビューデータを返す
    return NextResponse.json({ reviews: formattedReviews || [] });
  } catch (error) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `レビューの取得に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
