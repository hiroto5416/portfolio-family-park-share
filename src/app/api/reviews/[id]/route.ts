import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { uploadReviewImages } from '@/lib/uploadImage';
import { createClient } from '@supabase/supabase-js';

// レビュー更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;

    // NextAuthでのセッション確認
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

    // フォームデータをパース
    const formData = await request.formData();
    const content = formData.get('content') as string;

    // レビューの取得と所有者確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    // 所有者確認
    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: 'このレビューを編集する権限がありません' },
        { status: 403 }
      );
    }

    // 削除する画像の処理
    const deletedImageUrls: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('deletedImages[')) {
        deletedImageUrls.push(value as string);
      }
    }

    // 画像を削除
    if (deletedImageUrls.length > 0) {
      // Prismaを使用して画像エントリを削除
      await prisma.reviewImage.deleteMany({
        where: {
          reviewId: reviewId,
          imageUrl: { in: deletedImageUrls },
        },
      });

      // ここはストレージ機能のみSupabaseを使用
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // URLからファイルパスを抽出して削除
      for (const url of deletedImageUrls) {
        const path = url.split('/').slice(-2).join('/');
        await supabase.storage.from('review-images').remove([path]);
      }
    }

    // 新しい画像のアップロード
    const imageFiles = formData.getAll('images') as File[];
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      // 画像をアップロードして公開URLを取得
      imageUrls = await uploadReviewImages(imageFiles, reviewId);

      // Prismaを使用して画像URLを保存
      for (const imageUrl of imageUrls) {
        await prisma.reviewImage.create({
          data: {
            reviewId: reviewId,
            imageUrl: imageUrl,
          },
        });
      }
    }

    // レビュー内容を更新
    await prisma.review.update({
      where: { id: reviewId },
      data: { content },
    });

    return NextResponse.json({ message: 'レビューが更新されました', imageUrls }, { status: 200 });
  } catch (error) {
    console.error('レビュー更新エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// レビュー削除 - 同様にNextAuth認証に変更
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const reviewId = params.id;

  if (!reviewId) {
    return NextResponse.json({ error: 'レビューIDが必要です' }, { status: 400 });
  }

  try {
    // NextAuthでのセッション確認
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

    // レビューの取得と所有者確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    // 所有者確認
    if (review.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    // 関連画像の削除
    await prisma.reviewImage.deleteMany({
      where: { reviewId },
    });

    // いいねの削除
    await prisma.like.deleteMany({
      where: { reviewId },
    });

    // レビュー削除
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('削除エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
