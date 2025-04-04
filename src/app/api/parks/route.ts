import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        (error.message.includes('connection') ||
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
 * 公園データを保存するAPI
 * @param request リクエストオブジェクト
 * @returns レスポンスオブジェクト
 */
export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // 公園データを保存（リトライロジック付き）
    const park = await withRetry(async () => {
      return await prisma.park.upsert({
        where: { place_id: body.place_id },
        update: {
          name: body.name,
          address: body.address,
        },
        create: {
          place_id: body.place_id,
          name: body.name,
          address: body.address,
        },
      });
    });

    return NextResponse.json({ success: true, park });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('公園データの保存エラー:', {
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

      return NextResponse.json({ error: '公園データの保存に失敗しました' }, { status: 500 });
    } else {
      console.error('不明なエラーが発生しました:', error);
      return NextResponse.json(
        { error: '公園データの保存に失敗しました: 不明なエラー' },
        { status: 500 }
      );
    }
  }
}
