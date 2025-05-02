import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 保護が必要なルート
const protectedRoutes = ['/mypage'];

/**
 * ミドルウェア
 * @param request リクエスト
 * @returns レスポンス
 */
export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const path = request.nextUrl.pathname;

    // 保護されたルートの場合のみ認証チェックを実行
    if (protectedRoutes.includes(path)) {
      // Supabaseの認証処理
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({ name, value, ...options });
              response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({ name, value: '', ...options });
              response.cookies.set({ name, value: '', ...options });
            },
          },
        }
      );

      const {
        data: { session },
        error: supabaseError,
      } = await supabase.auth.getSession();

      if (supabaseError) {
        console.error('Supabase認証エラー:', supabaseError);
        // エラーページにリダイレクト
        return NextResponse.redirect(new URL('/error', request.url));
      }

      // NextAuthの認証チェック
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // どちらかの認証が失敗した場合、ログインページへリダイレクト
      if (!session && !token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.error('ミドルウェアエラー:', error);
    // エラーページにリダイレクト
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
