import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import React, { useState } from 'react';

/**
 * パスワードフォーム
 */
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 設定タブ
 * @returns 設定タブ
 */
export const SettingsTab = () => {
  // const [locationEnabled, setLocationEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (password.length < 8 || password.length > 32) {
      return {
        isValid: false,
        error: 'パスワードは8文字以上32文字以下で入力してください',
      };
    }

    if (!/\d/.test(password)) {
      return {
        isValid: false,
        error: 'パスワードには最低1つの数字を含めてください',
      };
    }

    return { isValid: true, error: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('新しいパスワードが一致しません');
      setIsLoading(false);
      return;
    }

    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.isValid) {
      setError(validation.error);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('パスワードの更新に失敗しました');
      }

      setSuccess('パスワードを更新しました');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-primary">パスワード変更</h2>
          </div>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>パスワードを変更</Button>}
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">現在のパスワード</label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">新しいパスワード</label>
              <Input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">新しいパスワード（確認）</label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '更新中...' : '保存'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
