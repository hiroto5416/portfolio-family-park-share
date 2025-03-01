'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // パスワードバリデーション
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        setError(validation.error);
        setIsLoading(false);
        return;
      }

      // パスワード確認
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました');
      }

      // 登録成功後の処理
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('ログインに失敗しました');
      }

      window.location.href = '/';
    } catch (error) {
      setError(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    // 長さチェック（８〜３２文字）
    if (password.length < 8 || password.length > 32) {
      return {
        isValid: false,
        error: 'パスワードは８文字以上３２文字以下で入力してください',
      };
    }

    // 数字を含むかチェック
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        error: 'パスワードには最低一つの数字を含めてください',
      };
    }

    return { isValid: true, error: '' };
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-start pt-6 md:pt-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] md:w-[450px]">
        {/* 登録フォーム */}
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center md:text-2xl ms:test-xl">新規登録</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-sm leading-none" htmlFor="">
                  お名前
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm leading-none" htmlFor="email">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm leading-none" htmlFor="password">
                  パスワード
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold leading-none" htmlFor="confirmPassword">
                  パスワード（確認）
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 md:text-lg sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? '登録中...' : '新規登録'}
              </Button>

              <div className="mt-6 text-center text-base">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-primary hover:underline">
                  ログイン
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
