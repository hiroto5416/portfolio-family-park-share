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
    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // いいねの確認
    const like = await prisma.like.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `いいね状態の取得に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// いいねのトグル（追加/削除）
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // レビューの存在確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

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

      return NextResponse.json({ liked: false });
    } else {
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

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `いいねのトグルに失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
