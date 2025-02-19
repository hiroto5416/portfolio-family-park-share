'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trees } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Trees className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">FAMILY PARK SHARE</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  placeholder="tarou.yamada@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </div>
              <div className="space-y-2">
                <label className="text-ms font-medium leading-none" htmlFor="password">
                  パスワード
                </label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">ログイン</Button>
            </div>

            <div className="mt-4 text-center text-sm">
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
