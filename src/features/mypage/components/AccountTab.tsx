'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { UserReviews } from './UserReviews';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { uploadAvatar } from '@/lib/uploadAvatar';

/**
 * アカウントタブのプロップス
 */
interface AccountTabProps {
  initialData: {
    name: string;
    email: string;
    id: string;
    avatar_url?: string | null;
  };
}

/**
 * レビュー
 */
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

/**
 * アカウントタブ
 * @param initialData 初期データ
 * @returns アカウントタブ
 */
export function AccountTab({ initialData }: AccountTabProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar_url || null);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchUserReviews(userId: string) {
    setIsLoading(true);
    try {
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

  const convertedReviews = reviews.map((review, index) => {
    // UUIDをそのまま使用
    return {
      id: review.id || `temp-${index}`, // UUIDをそのまま文字列として使用
      parkName: review.parks?.name || '不明な公園',
      content: review.content,
      date: new Date(review.created_at).toLocaleDateString('ja-JP'),
      likes: review.likes_count,
      images: review.review_images?.map((img) => img.image_url) || [],
    };
  });

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（例：5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください');
        return;
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください');
        return;
      }

      setAvatarFile(file);
      // プレビューURLの作成
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('認証が必要です');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let avatarUrl = null;

      if (avatarFile) {
        try {
          // ファイルサイズチェック
          if (avatarFile.size > 5 * 1024 * 1024) {
            // 5MB制限
            throw new Error('ファイルサイズは5MB以下にしてください');
          }

          // ファイルタイプチェック
          if (!avatarFile.type.startsWith('image/')) {
            throw new Error('画像ファイルを選択してください');
          }

          avatarUrl = await uploadAvatar(avatarFile, initialData.id);
        } catch (error) {
          console.error('Upload error:', error);
          throw new Error(
            error instanceof Error ? error.message : '画像のアップロードに失敗しました'
          );
        }
      }

      // メールアドレスのバリデーション
      if (formData.email !== initialData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('有効なメールアドレスを入力してください');
        }
      }

      // プロフィール更新APIを呼び出し
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          avatarUrl: avatarUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロフィールの更新に失敗しました');
      }

      setSuccess('プロフィールを更新しました');

      // メールアドレスが変更された場合は、再ログインを要求
      if (formData.email !== initialData.email) {
        await signOut({ redirect: false });
        router.push('/login?message=メールアドレスを変更しました。再度ログインしてください。');
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error instanceof Error ? error.message : 'プロフィール更新中にエラーが発生しました');
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
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">メールアドレス</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">プロフィール画像</label>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="プロフィール画像プレビュー"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* ボタングループ */}
          <div className="mt-6">
            {/* モバイル表示用 */}
            <div className="md:hidden space-y-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  変更
                </Button>
              ) : (
                <>
                  <Button onClick={handleProfileUpdate} className="w-full" disabled={isLoading}>
                    保存
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                    キャンセル
                  </Button>
                </>
              )}
            </div>

            {/* デスクトップ表示用 */}
            <div className="hidden md:flex justify-end gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>変更</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleProfileUpdate} disabled={isLoading}>
                    保存
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
      <UserReviews
        reviews={convertedReviews}
        isLoading={isLoading}
        onReviewUpdated={() => initialData?.id && fetchUserReviews(initialData.id)}
      />
    </div>
  );
}
