import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { uploadReviewImages } from '@/lib/uploadImage';

// レビュー更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Supabaseクライアと

    const reviewId = params.id;

    // セッション確認
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // フォームデータをパース
    const formData = await request.formData();
    const content = formData.get('content') as string;

    // レビューの取得と所有者確認
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (reviewError || !reviewData) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    if (reviewData.user_id !== session.user.id) {
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

    // Supabaseから画像を削除
    if (deletedImageUrls.length > 0) {
      // URLからファイルパスを抽出
      const filePaths = deletedImageUrls.map((url) => {
        const path = url.split('/').slice(-2).join('/');
        return path;
      });

      for (const path of filePaths) {
        await supabase.storage.from('review-images').remove([path]);
      }

      // review_imagesテーブルからも削除
      for (const url of deletedImageUrls) {
        await supabase
          .from('review_images')
          .delete()
          .eq('image_url', url)
          .eq('review_id', reviewId);
      }
    }

    // 新しい画像のアップロード
    const imageFiles = formData.getAll('images') as File[];
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      // 画像をアップロードして公開URLを取得
      imageUrls = await uploadReviewImages(imageFiles, reviewId);

      // review_imagesテーブルに画像URLを保存
      for (const imageUrl of imageUrls) {
        await supabase.from('review_images').insert({
          review_id: reviewId,
          image_url: imageUrl,
        });
      }
    }

    // レビュー内容を更新
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ content })
      .eq('id', reviewId);

    if (updateError) {
      return NextResponse.json({ error: '更新中にエラーが発生しました' }, { status: 500 });
    }

    return NextResponse.json({ message: 'レビューが更新されました', imageUrls }, { status: 200 });
  } catch (error) {
    console.error('レビュー更新エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// レビュー削除
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const reviewId = params.id;

  if (!reviewId) {
    return NextResponse.json({ error: 'レビューIDが必要です' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // セッションからユーザーIDを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // セッションのユーザーIDを直接使用
    const userId = session.user.id;

    // レビューの所有者を確認
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (reviewError || !reviewData) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 });
    }

    // 所有者チェック - 直接セッションのIDと比較
    if (reviewData.user_id !== userId) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    // 関連画像の削除
    await supabase.from('review_images').delete().eq('review_id', reviewId);

    // いいねの削除
    await supabase.from('likes').delete().eq('review_id', reviewId);

    // レビュー削除
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (error) {
      return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('削除エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
