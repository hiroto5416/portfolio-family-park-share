import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * プロフィール更新API
 * @param request リクエスト
 * @returns プロフィール更新結果
 */
export async function PUT(request: Request) {
  try {
    const { name, email } = await request.json();

    // セッション情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('認証エラー: セッションが存在しないか、メールアドレスが見つかりません');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // メールアドレスが変更される場合、重複チェック
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.error('メールアドレス重複エラー:', { email });
        return NextResponse.json(
          { error: 'このメールアドレスは既に使用されています' },
          { status: 400 }
        );
      }
    }

    // Prismaを使用してユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        email: email || undefined,
      },
    });

    if (!updatedUser) {
      console.error('プロフィール更新失敗:', { currentUserEmail: session.user.email });
      return NextResponse.json({ error: 'プロフィールの更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('プロフィール更新エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: 'プロフィールの更新に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
