// // src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // 移動した認証設定をインポート

// ハンドラーを作成して GET と POST メソッドとしてエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };