import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabaseクライアント
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * プロフィール更新
 * @param request リクエスト
 * @returns レスポンス
 */
export async function PUT(request: Request) {
  try {
    const { name, avatarUrl } = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error } = await supabase
      .from('users')
      .update({
        name,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: 'プロフィールの更新に失敗しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
