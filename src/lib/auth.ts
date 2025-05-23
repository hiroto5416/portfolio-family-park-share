// src/lib/auth.ts として新しいファイルを作成
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AuthOptions, DefaultSession } from 'next-auth';
import bcrypt from 'bcryptjs';

// セッションのユーザー型を拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      avatarUrl?: string | null;
    } & DefaultSession['user'];
  }
}

/**
 * 認証オプション
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // ユーザーIDをセッションに追加
        session.user.id = token.sub;

        // データベースからユーザー情報を取得してavatarUrlを追加
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { avatarUrl: true },
          });

          if (user?.avatarUrl) {
            session.user.avatarUrl = user.avatarUrl;
          }
        } catch (error) {
          console.error('Failed to fetch user avatarUrl for session:', error);
        }
      }
      return session;
    },
  },
};
