import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function PUT(request: Request) {
  try {
    const { name, avatarUrl, email } = await request.json();

    // セッション情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // usersテーブルを直接更新
    const { error } = await supabase
      .from('users')
      .update({
        name,
        avatar_url: avatarUrl,
        email: email || session.user.email,
      })
      .eq('email', session.user.email);

    if (error) {
      console.error('Update error:', error);
      return new Response(JSON.stringify({ error: 'プロフィールの更新に失敗しました' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
