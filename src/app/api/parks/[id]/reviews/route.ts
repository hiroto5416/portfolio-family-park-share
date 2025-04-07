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
 * @param initialDelay
 * @returns
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`試行 ${i + 1}/${maxRetries} 失敗:`, error);

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * 公園のレビューを取得するAPI
 * @param _request リクエストオブジェクト
 * @param context ルートコンテキスト
 * @returns レスポンスオブジェクト
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    const p = await context.params;
    const parkId = p.id;

    console.log(`[${requestId}] レビュー取得開始:`, {
      parkId,
      timestamp: new Date().toISOString(),
    });

    const reviews = await withRetry(async () => {
      const result = await prisma.review.findMany({
        where: { parkId },
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
        orderBy: { createdAt: 'desc' },
      });

      console.log(`[${requestId}] クエリ実行完了:`, {
        reviewCount: result.length,
        executionTime: Date.now() - startTime,
      });

      return result;
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(`[${requestId}] 詳細なエラー情報:`, {
      executionTime: Date.now() - startTime,
      error: {
        message: error instanceof Error ? error.message : '不明なエラー',
        name: error instanceof Error ? error.name : '不明',
        stack: error instanceof Error ? error.stack : undefined,
      },
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      },
      context: {
        parkId: (await context.params).id,
      },
      prismaInfo: {
        connectionUrl: process.env.DATABASE_URL ? '設定済み' : '未設定',
        directUrl: process.env.DIRECT_URL ? '設定済み' : '未設定',
      },
    });

    return NextResponse.json({ error: 'レビューの取得に失敗しました' }, { status: 500 });
  }
}
