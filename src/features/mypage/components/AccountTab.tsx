import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { User } from 'lucide-react';
import { UserReviews } from './UserReviews';

interface AccountTabProps {
  initialData: UserProfile;
}

export const AccountTab = ({ initialData }: AccountTabProps) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log('保存されたデータ:', formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
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
            <Input type="file" accept="image/*" className="cursor-pointer" disabled={!isEditing} />
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
                  <Button onClick={handleSave} className="w-full">
                    保存
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="w-full">
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
                  <Button variant="outline" onClick={handleCancel}>
                    キャンセル
                  </Button>
                  <Button onClick={handleSave}>保存</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
      <UserReviews reviews={MOCK_REVIEWS} />
    </div>
  );
};
