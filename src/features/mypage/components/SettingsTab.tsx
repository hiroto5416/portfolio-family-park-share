import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Lock, MapPin } from 'lucide-react';
import React, { useState } from 'react';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const SettingsTab = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-primary">パスワード変更</h2>
          </div>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>変更</Button>}
        </div>

        {isEditing && (
          <div className="space-y-4 ">
            <div className="space-y-2">
              <label className="text-sm font-medium">現在のパスワード</label>
              <div className="relative">
                <Input
                  name="currentPassword"
                  type="password"
                  className="pl-9"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">新しいパスワード</label>
              <div className="relative">
                <Input
                  name="newPassword"
                  type="password"
                  className="pl-9"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">新しいパスワード（確認）</label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type="password"
                  className="pl-9"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button>保存</Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold text-primary">位置情報の選択</h2>
              <p className="text-sm text-muted-foreground mt-1">
                位置情報を利用すると、近くの公園を簡単に見つけることができます。
                この設定はいつでも変更できます。
              </p>
            </div>
          </div>
          <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
        </div>
      </Card>
    </div>
  );
};
