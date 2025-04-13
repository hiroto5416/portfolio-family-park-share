'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * 削除確認モーダルのプロップス
 */
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 削除確認モーダー
 * @param isOpen モーダーが開いているかどうか
 * @param onClose モーダーを閉じる
 * @param onConfirm 削除を確認する
 */
export function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>レビューの削除</AlertDialogTitle>
          <AlertDialogDescription>
            このレビューを削除してもよろしいですか？
            <br />
            この操作は取り消すことができません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
