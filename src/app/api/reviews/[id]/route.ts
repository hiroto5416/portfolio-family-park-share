// src/app/api/reviews/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// レビュー更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const reviewId = params.id;
  const { content } = await request.json();

  if (!reviewId || !content) {
    return NextResponse.json({ error: '必要なデータが不足しています' }, { status: 400 });
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

    // レビュー更新
    const { data, error } = await supabase
      .from('reviews')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('更新エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
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
