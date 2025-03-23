import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import { uploadReviewImages } from '@/lib/uploadImage';

export async function POST(request: Request) {
  console.log('===== レビュー投稿API開始 =====');
  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const parkId = formData.get('parkId') as string;
    const imageFiles = formData.getAll('images');

    console.log('受信したデータ:', { content, parkId, imageCount: imageFiles.length });

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // 公園データを検索
    const park = await prisma.park.findFirst({
      where: {
        OR: [{ place_id: parkId }, { id: parkId }],
      },
    });

    if (!park) {
      console.log('公園が見つかりません:', parkId);
      return NextResponse.json({ error: '公園が見つかりません' }, { status: 404 });
    }

    // データベース内のユーザー一覧を確認
    const allUsers = await prisma.user.findMany({
      take: 10, // 最初の10件だけ取得
    });
    console.log('データベースのユーザー一覧:', JSON.stringify(allUsers, null, 2));

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
        console.log('ユーザー作成成功:', user);
      } catch (userCreateError) {
        console.error('ユーザー作成エラー:', userCreateError);
        return NextResponse.json({ error: 'ユーザーの作成に失敗しました' }, { status: 500 });
      }
    }

    // レビューの作成
    const review = await prisma.review.create({
      data: {
        content,
        parkId: park.id,
        userId: user.id,
      },
    });

    // 画像のアップロードと保存
    if (imageFiles.length > 0) {
      const imageUrls = await uploadReviewImages(imageFiles as File[], review.id);

      await prisma.reviewImage.createMany({
        data: imageUrls.map((url) => ({
          reviewId: review.id,
          imageUrl: url,
        })),
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('レビュー作成エラー:', error);
    return NextResponse.json({ error: 'レビューの作成に失敗しました' }, { status: 500 });
  } finally {
    console.log('===== レビュー投稿API終了 =====');
  }
}
