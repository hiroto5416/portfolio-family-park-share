import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * 公園のレビューを取得するAPI
 * @param request リクエスト
 * @param params パラメータ（公園ID）
 * @returns レビューのリスト
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    console.log('Fetching reviews for park:', params.id);

    // 1. 公園IDの確認（place_idからidへの変換）
    const parkResult = await supabase.from('parks').select('id').eq('place_id', params.id).single();

    // 公園IDを取得（失敗した場合はパラメータのIDをそのまま使用）
    const parkId = parkResult.error ? params.id : parkResult.data?.id;
    console.log('Using park ID for reviews query:', parkId);

    // 2. レビューの取得
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(
        `
        id,
        content,
        created_at,
        likes_count,
        profiles (
          username
        ),
        review_images (
          image_url
        )
      `
      )
      .eq('park_id', parkId)
      .order('created_at', { ascending: false });

    // エラーチェック
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: `レビュー取得エラー: ${error.message}` }, { status: 500 });
    }

    // 成功時はレビューデータを返す
    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `レビューの取得に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
