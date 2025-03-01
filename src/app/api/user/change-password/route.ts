import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // 現在のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 現在のパスワードを確認
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 400 });
    }

    // 新しいパスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // パスワードを更新
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'パスワードを更新しました' });
  } catch {
    return NextResponse.json({ error: 'パスワードの更新に失敗しました' }, { status: 500 });
  }
}
