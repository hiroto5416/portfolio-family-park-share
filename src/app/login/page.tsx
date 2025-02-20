'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-start pt-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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
                />
              </div>
              <div>
                <label className="text-sm font-bold leading-none" htmlFor="password">
                  パスワード
                </label>
                <Input id="password" type="password" className="h-12 text-lg" />
              </div>
              <Button className="w-full h-12 text-lg">ログイン</Button>
            </div>

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
