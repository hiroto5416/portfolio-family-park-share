import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// RouteContext型の定義
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// いいね状態の取得
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    console.log('いいね状態確認API開始');

    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;
    console.log('レビューID:', reviewId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('未認証アクセス');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error('ユーザーが見つかりません:', session.user.email);
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    console.log('いいね状態確認中:', { userId: user.id, reviewId });

    // いいねの確認
    const like = await prisma.like.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id,
        },
      },
    });

    console.log('いいね状態:', { exists: !!like });
    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('いいね状態確認エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: '処理に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// いいねのトグル（追加/削除）
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    console.log('いいねトグルAPI開始');

    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;
    console.log('レビューID:', reviewId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('未認証アクセス');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error('ユーザーが見つかりません:', session.user.email);
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // レビューの存在確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      console.error('レビューが見つかりません:', reviewId);
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    console.log('いいね状態確認中:', { userId: user.id, reviewId });

    // いいねの確認
    const existingLike = await prisma.like.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      console.log('いいね削除処理開始');
      // いいねを削除
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // レビューのいいね数を更新
      await prisma.review.update({
        where: { id: reviewId },
        data: { likesCount: { decrement: 1 } },
      });

      console.log('いいね削除完了');
      return NextResponse.json({ liked: false });
    } else {
      console.log('いいね作成処理開始');
      // いいねを作成
      await prisma.like.create({
        data: {
          reviewId,
          userId: user.id,
        },
      });

      // レビューのいいね数を更新
      await prisma.review.update({
        where: { id: reviewId },
        data: { likesCount: { increment: 1 } },
      });

      console.log('いいね作成完了');
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('いいね処理エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: '処理に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
