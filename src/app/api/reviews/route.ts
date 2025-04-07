import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { uploadReviewImages } from '@/lib/uploadImage';

export async function POST(request: Request) {
  console.log('===== レビュー投稿API開始 =====');
  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const parkId = formData.get('parkId') as string;
    const imageFiles = formData.getAll('images');

    console.log('受信したデータ:', {
      content: content?.substring(0, 50) + (content?.length > 50 ? '...' : ''),
      parkId,
      imageCount: imageFiles.length,
    });

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('未認証アクセス');
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // 公園データを検索
    const park = await prisma.park.findFirst({
      where: {
        OR: [{ place_id: parkId }, { id: parkId }],
      },
    });

    if (!park) {
      console.error('公園が見つかりません:', parkId);
      return NextResponse.json({ error: '公園が見つかりません' }, { status: 404 });
    }

    console.log('公園データ取得成功:', {
      id: park.id,
      name: park.name,
    });

    // ユーザーを検索
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // ユーザーが存在しない場合は作成
    if (!user) {
      console.log('ユーザーが存在しないため作成します:', session.user.email);
      try {
        // パスワードはダミー値を設定（実際の認証はNextAuthで行われるため）
        const hashedPassword = await bcrypt.hash('dummyPassword', 10);

        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || session.user.email.split('@')[0],
            password: hashedPassword,
            privacySettings: {
              create: {
                locationEnabled: false,
              },
            },
          },
        });
        console.log('ユーザー作成成功:', {
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (userCreateError) {
        console.error('ユーザー作成エラー:', {
          error: userCreateError,
          message: userCreateError instanceof Error ? userCreateError.message : '不明なエラー',
          email: session.user.email,
        });
        return NextResponse.json({ error: 'ユーザーの作成に失敗しました' }, { status: 500 });
      }
    }

    console.log('レビュー作成開始');

    // レビューの作成
    const review = await prisma.review.create({
      data: {
        content,
        parkId: park.id,
        userId: user.id,
      },
    });

    console.log('レビュー作成成功:', {
      id: review.id,
      parkId: review.parkId,
      userId: review.userId,
    });

    // 画像のアップロードと保存
    if (imageFiles.length > 0) {
      console.log('画像アップロード処理開始');
      const imageUrls = await uploadReviewImages(imageFiles as File[], review.id);

      await prisma.reviewImage.createMany({
        data: imageUrls.map((url) => ({
          reviewId: review.id,
          imageUrl: url,
        })),
      });
      console.log('画像アップロード完了:', { count: imageUrls.length });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('レビュー作成エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: 'レビューの作成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  } finally {
    console.log('===== レビュー投稿API終了 =====');
  }
}
