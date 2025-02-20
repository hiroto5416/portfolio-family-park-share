'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountTab } from '@/features/mypage/components/AccountTab';
import { SettingsTab } from '@/features/mypage/components/SettingsTab';
import React from 'react';

const MOCK_USER_DATA = {
  username: '山田 太郎',
  email: 'tarou.yamada@example.com',
  avatar: null
}

export default function MyPage() {
  return (
    <div className='container max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold mb-6'>マイページ</h1>

      <Tabs defaultValue='account' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value="account">アカウント</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountTab initialData={MOCK_USER_DATA} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
