// src/app/api/reviews/user/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Step 1: userIdからprofilesのidを取得する
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profileData) {
      console.error('プロファイル取得エラー:', profileError);
      return NextResponse.json({ error: 'プロファイルが見つかりませんでした' }, { status: 404 });
    }

    // Step 2: profilesのidを使用してレビューを取得
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(
        `
        *,
        parks (*),
        review_images (*)
      `
      )
      .eq('user_id', profileData.id)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('レビュー取得エラー:', reviewsError);
      return NextResponse.json({ error: 'レビューの取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('API処理エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
