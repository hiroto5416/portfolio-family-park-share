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
  const path = request.nextUrl.pathname;

  // 保護されたルートかチェック
  if (protectedRoutes.includes(path)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 未認証の場合、ログインページへリダイレクト
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
