import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // リクエストボディを取得
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const parkId = formData.get('parkId') as string;
    // const images = formData.getAll('images') as File[];

    // バリデーション
    if (!content || !parkId) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // レビューの作成
    const review = await prisma.review.create({
      data: {
        content,
        parkId,
        userId: session.user.id,
      },
    });

    // 画像の保存処理

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('レビュー作成エラー:', error);
    return NextResponse.json(
      { success: false, error: 'レビューの作成に失敗しました' },
      { status: 500 }
    );
  }
}
