import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadReviewImages } from '@/lib/uploadImage';
import { createClient } from '@supabase/supabase-js';

// RouteContext型の定義
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// レビュー更新
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    console.log('レビュー更新API開始');

    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;
    console.log('レビューID:', reviewId);

    // NextAuthでのセッション確認
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('未認証アクセス');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error('ユーザーが見つかりません:', session.user.email);
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // フォームデータをパース
    const formData = await request.formData();
    const content = formData.get('content') as string;
    console.log('更新内容:', { content });

    // レビューの取得と所有者確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      console.error('レビューが見つかりません:', reviewId);
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    // 所有者確認
    if (review.userId !== user.id) {
      console.error('権限エラー:', { reviewUserId: review.userId, requestUserId: user.id });
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

    console.log('削除対象画像:', deletedImageUrls);

    // 画像を削除
    if (deletedImageUrls.length > 0) {
      console.log('画像削除処理開始');
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
      console.log('画像削除完了');
    }

    // 新しい画像のアップロード
    const imageFiles = formData.getAll('images') as File[];
    console.log('新規アップロード画像数:', imageFiles.length);

    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      console.log('画像アップロード処理開始');
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
      console.log('画像アップロード完了:', imageUrls);
    }

    // レビュー内容を更新
    await prisma.review.update({
      where: { id: reviewId },
      data: { content },
    });

    console.log('レビュー更新完了');

    return NextResponse.json({ message: 'レビューが更新されました', imageUrls }, { status: 200 });
  } catch (error) {
    console.error('レビュー更新エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// レビュー削除
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    console.log('レビュー削除API開始');

    // Promiseからパラメータを取得
    const p = await context.params;
    const reviewId = p.id;
    console.log('レビューID:', reviewId);

    if (!reviewId) {
      console.error('レビューIDが指定されていません');
      return NextResponse.json({ error: 'レビューIDが必要です' }, { status: 400 });
    }

    // NextAuthでのセッション確認
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('未認証アクセス');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error('ユーザーが見つかりません:', session.user.email);
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // レビューの取得と所有者確認
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      console.error('レビューが見つかりません:', reviewId);
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    // 所有者確認
    if (review.userId !== user.id) {
      console.error('権限エラー:', { reviewUserId: review.userId, requestUserId: user.id });
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    console.log('関連データ削除開始');

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

    console.log('レビュー削除完了');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('レビュー削除エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: '予期せぬエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
