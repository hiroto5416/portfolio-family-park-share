import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';

// NextAuthの設定オグジェクト作成
const handler = NextAuth({
  // Prismaアダプターの設定(NextAuthがユーザー情報をデータベースに保存・取得するための設定)
  adapter: PrismaAdapter(prisma),
  // 認証プロバイダーの設定(どのような認証方法を使うかを指定。今回はメール/パスワード認証を設定)
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 入力値のチェック：メールとパスワードが入力されているか確認
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードを入力してください');
        }

        // ユーザー検索：メールアドレスでデータベースからユーザーを検索
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }

        // パスワード検証：bcryptを使って、入力されたパスワードとDBのハッシュ化されたパスワードを比較
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
        // 認証成功：すべて正しければユーザー情報を返す（これがセッションに保存される）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  // セッション設定（ユーザーログイン状態をJWTトークンで管理する設定）
  session: {
    strategy: 'jwt',
  },
  // ページ設定（ログインページのURLを指定）
  pages: {
    signIn: '/login',
  },
});

// エクスポート（APIルートがGETとPOSTリクエストに応答できるようにエクスポートする）
export { handler as GET, handler as POST };
