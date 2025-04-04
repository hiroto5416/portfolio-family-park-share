import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * リトライロジックを実装
 * @param fn
 * @param maxRetries
 * @param delay
 * @returns
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 500): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`接続試行 ${attempt + 1}/${maxRetries} 失敗:`, error.message);
        lastError = error;
      } else {
        console.log(`接続試行 ${attempt + 1}/${maxRetries} 失敗:`, error);
        lastError = new Error('不明なエラーが発生しました');
      }

      // データベース関連のエラーのみリトライ
      const isDbConnectionError =
        error instanceof Error &&
        (error.message === 'PARK_NOT_FOUND'
          ? false
          : error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.message.includes('database') ||
            error.name.includes('Prisma'));

      if (!isDbConnectionError) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, delay * Math.pow(2, attempt)));
    }
  }

  throw lastError!;
}

/**
 * 公園のレビューを取得するAPI
 * @param _request リクエストオブジェクト
 * @param context ルートコンテキスト
 * @returns レスポンスオブジェクト
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const p = await context.params;
    const id = p.id;
    console.log('Fetching reviews for park:', id);

    // リトライロジックを使って公園の確認とレビュー取得を行う
    const formattedReviews = await withRetry(async () => {
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
        throw new Error('PARK_NOT_FOUND');
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
      return reviews.map((review) => ({
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
    });

    // 成功時はレビューデータを返す
    return NextResponse.json({ reviews: formattedReviews || [] });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Review fetch error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        // 環境変数の存在確認
        env: {
          DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
          DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
          NODE_ENV: process.env.NODE_ENV,
        },
      });

      // エラータイプに応じたレスポンス
      if (error.message === 'PARK_NOT_FOUND') {
        return NextResponse.json({ error: '公園が見つかりません' }, { status: 404 });
      }

      if (
        error.name &&
        error.name.includes('Prisma') &&
        (error.message.includes('connection') || error.message.includes('database'))
      ) {
        return NextResponse.json(
          { error: 'データベースへの接続に失敗しました。しばらくしてからお試しください。' },
          { status: 503 } // Service Unavailable
        );
      }

      const errorMessage = error.message;
      return NextResponse.json(
        { error: `レビューの取得に失敗しました: ${errorMessage}` },
        { status: 500 }
      );
    } else {
      console.error('不明なエラーが発生しました:', error);
      return NextResponse.json(
        { error: 'レビューの取得に失敗しました: 不明なエラー' },
        { status: 500 }
      );
    }
  }
}
