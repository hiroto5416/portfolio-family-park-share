import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  console.log('===== パスワード変更API開始 =====');
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.error('認証エラー: セッションが存在しないか、メールアドレスが見つかりません');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    console.log('パスワード変更リクエスト受信:', { userEmail: session.user.email });

    // 現在のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      console.error('ユーザー取得エラー:', { userEmail: session.user.email, userFound: !!user });
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 現在のパスワードを確認
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      console.error('パスワード検証エラー: 現在のパスワードが一致しません', {
        userEmail: session.user.email,
      });
      return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 400 });
    }

    // 新しいパスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // パスワードを更新
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    console.log('パスワード更新成功:', { userEmail: session.user.email });
    return NextResponse.json({ message: 'パスワードを更新しました' });
  } catch (error) {
    console.error('パスワード変更エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: 'パスワードの更新に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  } finally {
    console.log('===== パスワード変更API終了 =====');
  }
}
