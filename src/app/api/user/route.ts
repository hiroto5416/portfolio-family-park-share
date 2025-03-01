import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: username },
    });

    return NextResponse.json({ user: updatedUser });
  } catch {
    return NextResponse.json({ error: 'プロフィールの更新に失敗しました' }, { status: 500 });
  }
}
