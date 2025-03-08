import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // リクエストボディを取得
    const formData = await request.formData();
    const content = formData.get('content');
    const parkId = formData.get('parkId');
    // const images = formData.getAll('images') as File[];

    // バリデーション
    if (!content || !parkId) {
      return new Response(JSON.stringify({ error: '必須項目が不足しています' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // レビューの作成
    const review = await prisma.review.create({
      data: {
        content: content.toString(),
        parkId: parkId.toString(),
        userId: session.user.id,
      },
    });

    // 画像の保存処理

    return new Response(JSON.stringify({ success: true, review }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('レビュー作成エラー:', error);
    return new Response(
      JSON.stringify({
        error: 'レビューの作成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
