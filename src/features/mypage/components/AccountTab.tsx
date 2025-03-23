'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { UserReviews } from './UserReviews';
import { useRouter } from 'next/navigation';

interface AccountTabProps {
  initialData: {
    name: string;
    email: string;
    id: string;
  };
}

// レビューの型定義
interface Review {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  park_id: string;
  parks: {
    id: string;
    name: string;
  };
  review_images: {
    id: string;
    image_url: string;
  }[];
}

export function AccountTab({ initialData }: AccountTabProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    name: initialData.name,
  });

  async function fetchUserReviews(userId: string) {
    setIsLoading(true);
    try {
      // 実際のセッションから取得したIDを使用
      const response = await fetch(`/api/reviews/by-user?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レビュー取得に失敗しました');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('レビュー取得エラー', err);
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }

  const convertedReviews = reviews.map((review, index) => ({
    id: review.id ? Number(review.id) : index,
    parkName: review.parks?.name || '不明な公園',
    content: review.content,
    date: new Date(review.created_at).toLocaleDateString('ja-JP'),
    likes: review.likes_count,
    images: review.review_images?.map((img) => img.image_url) || [],
  }));

  // ユーザーのレビューを取得
  useEffect(() => {
    if (initialData?.id) {
      fetchUserReviews(initialData.id);
    }
  }, [initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました');
      }

      setSuccess('プロフィールを更新しました');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-primary">プロフィール</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">お名前</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">メールアドレス</label>
            <Input
              name="email"
              type="email"
              value={initialData.email}
              onChange={handleChange}
              disabled={!isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">プロフィール画像</label>
            <Input type="file" accept="image/*" className="cursor-pointer" disabled={!isLoading} />
          </div>

          {/* ボタングループ */}
          <div className="mt-6">
            {/* モバイル表示用 */}
            <div className="md:hidden space-y-2">
              {!isLoading ? (
                <Button onClick={() => setIsLoading(true)} className="w-full">
                  変更
                </Button>
              ) : (
                <>
                  <Button onClick={handleProfileUpdate} className="w-full">
                    保存
                  </Button>
                  <Button variant="outline" onClick={() => setIsLoading(false)} className="w-full">
                    キャンセル
                  </Button>
                </>
              )}
            </div>

            {/* デスクトップ表示用 */}
            <div className="hidden md:flex justify-end gap-4">
              {!isLoading ? (
                <Button onClick={() => setIsLoading(true)}>変更</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsLoading(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleProfileUpdate}>保存</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
      <UserReviews reviews={convertedReviews} isLoading={isLoading} />
    </div>
  );
}
