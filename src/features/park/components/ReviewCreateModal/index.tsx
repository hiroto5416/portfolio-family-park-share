'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { X, Upload } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/error-message';
import { ERROR_CODES } from '@/utils/errors';

/**
 * ラベルコンポーネント
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

function Label({ children, htmlFor, ...props }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium mb-2 block" {...props}>
      {children}
    </label>
  );
}

/**
 * レビュー作成モーダルのプロップス
 */
interface ReviewCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkName: string;
  parkId: string;
  onSubmit: (content: string, images: File[], formData: FormData) => Promise<void>;
}

/**
 * レビュー作成モーダル
 * @param isOpen モーダルの表示状態
 * @param onClose モーダルを閉じる関数
 * @param parkName 公園名
 * @param parkId 公園ID
 * @param onSubmit 送信時の処理
 */
export function ReviewCreateModal({
  isOpen,
  onClose,
  parkName,
  parkId,
  onSubmit,
}: ReviewCreateModalProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 1000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGES = 5;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setCharCount(value.length);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      const fileArray = Array.from(e.target.files);

      // 画像の最大数をチェック
      if (images.length + fileArray.length > MAX_IMAGES) {
        setError({
          code: 'VALIDATION_ERROR',
          message: `画像は最大${MAX_IMAGES}枚までアップロードできます`,
        });
        return;
      }

      // ファイルサイズとタイプをチェック
      for (const file of fileArray) {
        if (file.size > MAX_FILE_SIZE) {
          setError({
            code: 'VALIDATION_ERROR',
            message: `ファイルサイズは5MB以下である必要があります: ${file.name}`,
          });
          return;
        }
      }

      setImages((prev) => [...prev, ...fileArray]);
      e.target.value = '';
      setError(null);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      setError({
        code: 'VALIDATION_ERROR',
        message: '画像のアップロードに失敗しました',
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!content.trim()) {
        setError({
          code: 'VALIDATION_ERROR',
          message: 'レビュー内容を入力してください',
        });
        return;
      }

      const formData = new FormData();
      formData.append('content', content);
      formData.append('parkId', parkId);

      images.forEach((image) => {
        formData.append('images', image);
      });

      setSubmitting(true);
      await onSubmit(content, images, formData);
      setError(null);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'レビューの投稿に失敗しました';
      setError({
        code: 'API_ERROR',
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-full max-w-4xl h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>{parkName}のレビューを書く</DialogTitle>
        </DialogHeader>

        {/* メインコンテンツ部分 - スクロール可能 */}
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-content">レビュー内容</Label>
              <Textarea
                id="review-content"
                placeholder="この公園の感想を書いてください"
                value={content}
                onChange={handleContentChange}
                className="min-h-32"
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}
                >
                  {charCount}/{MAX_CHARS}文字
                </span>
              </div>
            </div>

            {/* エラーメッセージの表示 */}
            {error && (
              <ErrorMessage
                code={error.code as keyof typeof ERROR_CODES}
                message={error.message}
                variant="error"
                action={
                  error.code === 'API_ERROR' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      再試行
                    </Button>
                  )
                }
              />
            )}

            <div>
              <Label htmlFor="images">画像（最大5枚）</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                {/* 画像プレビュー */}
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`プレビュー ${index + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() => setSelectedImage(URL.createObjectURL(image))}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* 画像アップロードボタン */}
                {images.length < 5 && (
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*,.heic"
                        className="hidden"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        multiple
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-6 w-6 mr-2" />
                        画像を追加
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* 大きな画像プレビュー */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="max-w-4xl max-h-[90vh] relative">
              <img src={selectedImage} alt="拡大プレビュー" className="max-w-full max-h-[90vh]" />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" disabled={!content.trim() || submitting} onClick={handleSubmit}>
            {submitting ? '投稿中...' : '投稿する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
