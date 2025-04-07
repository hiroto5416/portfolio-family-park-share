import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  try {
    console.log('ユーザーのレビューを取得:', userId);

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

    console.log(`${reviews.length}件のレビューを取得しました`);

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
    console.error('API処理エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
