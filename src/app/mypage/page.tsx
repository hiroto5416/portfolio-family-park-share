'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountTab } from '@/features/mypage/components/AccountTab';
import { SettingsTab } from '@/features/mypage/components/SettingsTab';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    console.log('NextAuthセッション:', session);
    // 以下の情報をコンソールで確認してください
    console.log('ユーザー識別情報:', {
      id: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name,
    });
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // sessionからユーザー情報を取得
  const userData = {
    username: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.image || null,
    id: session?.user?.email || '', // emailをIDとして使用する場合
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">アカウント</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountTab initialData={userData} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
