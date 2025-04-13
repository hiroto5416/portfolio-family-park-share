import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * ユーザー情報取得API
 * @returns ユーザー情報
 */
export async function GET() {
  try {
    // セッション情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('認証エラー: セッションが存在しないか、メールアドレスが見つかりません');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // Prismaを使用してユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      console.error('ユーザー取得エラー: ユーザーが見つかりません', {
        userEmail: session.user.email,
      });
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('ユーザー情報取得エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: 'ユーザーデータの取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
