import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * ユーザーのレビュー取得API
 * @param request リクエスト
 * @returns ユーザーのレビュー
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    console.error('バリデーションエラー: ユーザーIDが指定されていません');
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  try {
    // Prismaを使用してユーザーのレビューを取得
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        likesCount: true,
        park: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 返すデータを整形（元のSupabaseのレスポンス形式に合わせる）
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      content: review.content,
      created_at: review.createdAt.toISOString(),
      likes_count: review.likesCount,
      parks: {
        id: review.park.id,
        name: review.park.name,
      },
      review_images: review.images.map((image) => ({
        id: image.id,
        image_url: image.imageUrl,
      })),
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('ユーザーのレビュー取得エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
      userId,
    });
    return NextResponse.json(
      {
        error: 'レビューの取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  } finally {
  }
}
