// src/lib/review-service.ts
// import {  } from '@supabase/auth-helpers-nextjs';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * ユーザーのレビュー取得関数（二段階検索）
 * @returns ユーザーのレビュー
 */
export async function getUserReviews() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // セッションからユーザーIDを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return [];
  }

  // Step 1: SessionのuserIdからusersテーブルのIDを取得
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (usersError || !usersData) {
    console.error('プロファイルデータの取得に失敗しました:', usersError);
    return [];
  }

  // Step 2: 取得したusers.idを使ってreviewsを検索
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(
      `
      *,
      park:parks(*),
      images:review_images(*)
    `
    )
    .eq('user_id', usersData.id)
    .order('created_at', { ascending: false });

  if (reviewsError) {
    console.error('レビュー取得エラー:', reviewsError);
    return [];
  }

  return reviews || [];
}

/**
 * レビュー更新関数（二段階検索を使用）
 * @param reviewId レビューID
 * @param content レビュー内容
 * @returns レビュー
 */
export async function updateReview(reviewId: string, content: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // セッションからユーザーIDを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('ログインが必要です');
  }

  // Step 1: SessionのuserIdからusersテーブルのIDを取得
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (usersError || !usersData) {
    throw new Error('プロファイルデータの取得に失敗しました');
  }

  // Step 2: 更新前にレビューの所有者を確認
  const { data: existingReview, error: reviewError } = await supabase
    .from('reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (reviewError || !existingReview) {
    throw new Error('レビューの取得に失敗しました');
  }

  // ログインユーザーのプロファイルIDとレビューの作成者IDが一致するか確認
  if (existingReview.user_id !== usersData.id) {
    throw new Error('このレビューを編集する権限がありません');
  }

  // レビューを更新
  const { data, error } = await supabase
    .from('reviews')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('レビュー更新エラー:', error);
    throw new Error('レビューの更新に失敗しました');
  }

  return data;
}

/**
 * レビュー削除関数（二段階検索を使用）
 * @param reviewId レビューID
 * @returns レビュー
 */
export async function deleteReview(reviewId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // セッションからユーザーIDを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('ログインが必要です');
  }

  // Step 1: SessionのuserIdからusesテーブルのIDを取得
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (usersError || !usersData) {
    throw new Error('プロファイルデータの取得に失敗しました');
  }

  // Step 2: 削除前にレビューの所有者を確認
  const { data: existingReview, error: reviewError } = await supabase
    .from('reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (reviewError || !existingReview) {
    throw new Error('レビューの取得に失敗しました');
  }

  // ログインユーザーのプロファイルIDとレビューの作成者IDが一致するか確認
  if (existingReview.user_id !== usersData.id) {
    throw new Error('このレビューを削除する権限がありません');
  }

  // 関連する画像を先に削除
  await supabase.from('review_images').delete().eq('review_id', reviewId);

  // いいねを削除
  await supabase.from('likes').delete().eq('review_id', reviewId);

  // レビューを削除
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

  if (error) {
    console.error('レビュー削除エラー:', error);
    throw new Error('レビューの削除に失敗しました');
  }

  return true;
}

/**
 * レビュー作成関数（二段階検索を使用）
 * @param parkId 公園ID
 * @param content レビュー内容
 * @param imageUrls 画像URL
 * @returns レビュー
 */
export async function createReview(parkId: string, content: string, imageUrls?: string[]) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // セッションからユーザーIDを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('ログインが必要です');
  }

  // Step 1: SessionのuserIdからusersテーブルのIDを取得
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (usersError || !usersData) {
    throw new Error('プロファイルデータの取得に失敗しました');
  }

  // Step 2: usersData.idを使用してレビューを作成
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      park_id: parkId,
      user_id: usersData.id, // usersテーブルのIDを使用
      content: content,
    })
    .select()
    .single();

  if (error) {
    console.error('レビュー作成エラー:', error);
    throw new Error('レビューの作成に失敗しました');
  }

  // 画像がある場合は画像情報も登録
  if (imageUrls && imageUrls.length > 0 && data) {
    const reviewImages = imageUrls.map((url) => ({
      review_id: data.id,
      image_url: url,
    }));

    const { error: imageError } = await supabase.from('review_images').insert(reviewImages);

    if (imageError) {
      console.error('レビュー画像登録エラー:', imageError);
    }
  }

  return data;
}
