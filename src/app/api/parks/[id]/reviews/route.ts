import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * 公園のレビューを取得するAPI
 * @param _request リクエスト（未使用）
 * @param context パラメータ（公園IDを含む）
 * @returns レビューのリスト
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const p = await context.params;
    const id = p.id;
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
            avatarUrl: true,
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
        name: review.user.name,
        image: review.user.avatarUrl,
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
