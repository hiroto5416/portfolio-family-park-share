import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { UserProfile } from './types';
import { User } from 'lucide-react';

interface AccountTabProps {
  initialData: UserProfile;
}

export const AccountTab = ({ initialData }: AccountTabProps) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isEditing, setIsEditing] = useState(false);

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

          <div className="flex justify-end gap-4 mt-6">
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
      </Card>
    </div>
  );
};
