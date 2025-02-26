'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 入力フォームの変更を管理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      // 現在のフォームのデータをコピー
      ...formData,
      //　変更された不フィールドの名前と値を更新
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // ブラウザのデフォルト送信動作を停止
    e.preventDefault();
    // ローディング状態をオンにする
    setIsLoading(true);
    // 前回のエラーをクリア
    setError('');

    try {
      // NextAuthの認証機能でログオン
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else {
        // ログイン成功時、ホームページへ
        router.push('/');
        // ページの状態を更新
        router.refresh();
      }
    } catch {
      setError('ログイン中にエラーが発生しました');
    } finally {
      // 必ずローディング状態をオフにする
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-start pt-6 md:pt-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] md:w-[450px]">
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="font-bold text-center md:text-2xl sm:text-xl">ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div>
                  <label className="text-sm leading-none font-bold" htmlFor="email">
                    メールアドレス
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="h-12 text-lg"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold leading-none" htmlFor="password">
                    パスワード
                  </label>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 text-lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  className="w-full h-12 md:text-lg sm:text-base"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-base">
              アカウントをお持ちでない方は
              <Link href="/signin" className="text-primary hover:underline">
                新規登録
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
