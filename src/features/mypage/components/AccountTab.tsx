'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { UserReviews } from './UserReviews';
import { useRouter } from 'next/navigation';

interface AccountTabProps {
  initialData: {
    username: string;
    email: string;
  };
}

export function AccountTab({ initialData }: AccountTabProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: initialData.username,
  });

  const MOCK_REVIEWS = [
    {
      id: 1,
      parkName: '代々木公園',
      content: '広々としていて気持ちよかったです',
      date: '2024-11-15',
      likes: 5,
      images: [],
    },
    {
      id: 2,
      parkName: '井の頭公園',
      content: '池の周りの景色が綺麗でした',
      date: '2024-10-10',
      likes: 8,
      images: [],
    },
    {
      id: 3,
      parkName: '昭和記念公園',
      content: '家族でピクニックを楽しみました',
      date: '2024-09-20',
      likes: 6,
      images: [],
    },
    {
      id: 4,
      parkName: '日比谷公園',
      content: '静かで落ち着いた雰囲気が良かったです',
      date: '2024-08-30',
      likes: 4,
      images: [],
    },
    {
      id: 5,
      parkName: '葛西臨海公園',
      content: '観覧車からの景色が最高でした',
      date: '2024-07-25',
      likes: 9,
      images: [],
    },
    {
      id: 6,
      parkName: '代々木公園',
      content: 'ドッグランが広くて良かったです',
      date: '2024-06-12',
      likes: 7,
      images: [],
    },
    {
      id: 7,
      parkName: '砧公園',
      content: '子供向けの遊具が充実していました',
      date: '2024-05-18',
      likes: 3,
      images: [],
    },
    {
      id: 8,
      parkName: '上野恩賜公園',
      content: '動物園の後にのんびり過ごせました',
      date: '2024-04-22',
      likes: 6,
      images: [],
    },
    {
      id: 9,
      parkName: '新宿御苑',
      content: '桜がとても綺麗でした',
      date: '2024-03-29',
      likes: 10,
      images: [],
    },
    {
      id: 10,
      parkName: '光が丘公園',
      content: 'ジョギングコースが快適でした',
      date: '2024-02-14',
      likes: 5,
      images: [],
    },
    {
      id: 11,
      parkName: '小金井公園',
      content: 'バーベキューが楽しめました',
      date: '2024-01-08',
      likes: 8,
      images: [],
    },
    {
      id: 12,
      parkName: '井の頭公園',
      content: 'ボートに乗るのが楽しかったです',
      date: '2023-12-24',
      likes: 9,
      images: [],
    },
    {
      id: 13,
      parkName: '等々力渓谷公園',
      content: '都会とは思えない自然の豊かさでした',
      date: '2023-11-11',
      likes: 7,
      images: [],
    },
    {
      id: 14,
      parkName: '砧公園',
      content: '芝生が広くて子供が走り回れました',
      date: '2023-10-05',
      likes: 6,
      images: [],
    },
    {
      id: 15,
      parkName: '清澄庭園',
      content: '和風の庭園が美しく、癒されました',
      date: '2023-09-21',
      likes: 4,
      images: [],
    },
  ];

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
        body: JSON.stringify({ username: formData.username }),
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

  // const handlePasswordChange = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');
  //   setSuccess('');

  //   // 新しいパスワードの一致確認
  //   // if (formData.newPassword !== formData.confirmNewPassword) {
  //   //   setError('新しいパスワードが一致しません');
  //   //   setIsLoading(false);
  //   //   return;
  //   // }

  //   // // パスワードバリデーション
  //   // const validation = validatePassword(formData.newPassword);
  //   // if (!validation.isValid) {
  //   //   setError(validation.error);
  //   //   setIsLoading(false);
  //   //   return;
  //   // }

  //   try {
  //     const response = await fetch('/api/user/change-password', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       // body: JSON.stringify({
  //       //   currentPassword: formData.currentPassword,
  //       //   newPassword: formData.newPassword,
  //       // }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'パスワードの更新に失敗しました');
  //     }

  //     setSuccess('パスワードを更新しました');
  //     // フォームをリセット
  //     setFormData({
  //       ...formData,
  //       // currentPassword: '',
  //       // newPassword: '',
  //       // confirmNewPassword: '',
  //     });
  //   } catch (error) {
  //     setError(error instanceof Error ? error.message : '更新に失敗しました');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const validatePassword = (password: string): { isValid: boolean; error: string } => {
  //   // 長さチェック（8-32文字）
  //   if (password.length < 8 || password.length > 32) {
  //     return {
  //       isValid: false,
  //       error: 'パスワードは8文字以上32文字以下で入力してください',
  //     };
  //   }

  //   // 数字を含むかチェック
  //   if (!/\d/.test(password)) {
  //     return {
  //       isValid: false,
  //       error: 'パスワードには最低1つの数字を含めてください',
  //     };
  //   }

  //   return { isValid: true, error: '' };
  // };

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
              name="username"
              value={formData.username}
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
      <UserReviews reviews={MOCK_REVIEWS} />
    </div>
  );
}
