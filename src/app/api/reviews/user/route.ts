import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Supabaseクライアントのインポート

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    // オプションでメールも取得
    const userEmail = searchParams.get('userEmail') || '';

    console.log('検索パラメータ:', { userId, userEmail });

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 });
    }

    // 複数の条件で検索
    let query = supabase
      .from('reviews')
      .select(
        `
        id,
        content,
        likes_count,
        created_at,
        updated_at,
        park_id,
        user_id,
        parks (
          id,
          name
        ),
        review_images (
          id,
          image_url
        )
      `
      )
      .order('created_at', { ascending: false });

    // IDまたはメールアドレスでフィルタリング
    // Supabaseではor条件は.or('filter1.eq.value1,filter2.eq.value2')の形式で指定
    if (userEmail) {
      query = query.or(`user_id.eq.${userId},user_email.eq.${userEmail}`);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Supabaseエラー:', error);
      return NextResponse.json({ error: 'レビュー取得中にエラーが発生しました' }, { status: 500 });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('APIエラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
