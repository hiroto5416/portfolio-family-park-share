'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountTab } from '@/features/mypage/components/AccountTab';
import { SettingsTab } from '@/features/mypage/components/SettingsTab';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar_url: null,
    id: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ユーザーデータを取得
  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch('/api/user');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'ユーザーデータの取得に失敗しました');
          }
          const data = await response.json();
          setUserData({
            name: data.name || session.user.name || '',
            email: data.email || session.user.email || '',
            avatar_url: data.avatarUrl || null,
            id: data.id || session.user.id || '',
          });
        } catch (error) {
          console.error('ユーザーデータ取得エラー:', error);
          setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchUserData();
  }, [session]);

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

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
