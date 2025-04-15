'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountTab } from '@/features/mypage/components/AccountTab';
import { SettingsTab } from '@/features/mypage/components/SettingsTab';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

/**
 * マイページ
 * @returns マイページ
 */
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
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* スケルトンローダー: タイトル */}
        <Skeleton className="h-10 w-40 mb-6" />

        {/* スケルトンローダー: タブ */}
        <Skeleton className="h-10 w-full mb-6" />

        {/* スケルトンローダー: ユーザープロフィール */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {/* アバター */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-9 w-32" />
            </div>
            {/* 名前フィールド */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* メールアドレスフィールド */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* ボタン */}
            <div className="flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Card>

        {/* スケルトンローダー: レビュー */}
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-11/12 mb-2" />
                <Skeleton className="h-4 w-4/5 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
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
