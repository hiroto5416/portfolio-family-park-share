'use client';

import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import heic2any from 'heic-convert';

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id: number;
    content: string;
    parkName: string;
    images: string[];
  };
  onSave: (id: number, content: string, images: File[]) => void;
}

const convertHeicToJpeg = async (file: File): Promise<File> => {
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      const buffer = await file.arrayBuffer();
      const convertedBuffer = await heic2any({
        buffer: Buffer.from(buffer),
        format: 'JPEG',
        quality: 0.8,
      });

      return new File([convertedBuffer], file.name.replace('.heic', '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('HEIC変換エラー:', error);
      throw new Error('画像の変換に失敗しました');
    }
  }
  return file;
};

export function ReviewEditModal({ isOpen, onClose, review, onSave }: ReviewEditModalProps) {
  const [content, setContent] = useState(review.content);
  const [charCount, setCharCount] = useState(review.content.length);
  const [images, setImages] = useState<File[]>([]);
  const MAX_CHARS = 1000;
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const isValidSize = file.size <= MAX_FILE_SIZE;
          const isValidType =
            file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic');

          if (!isValidSize || !isValidType) return null;

          return await convertHeicToJpeg(file);
        })
      );

      const validFiles = processedFiles.filter((file): file is File => file !== null);

      if (validFiles.length + images.length <= MAX_IMAGES) {
        setImages([...images, ...validFiles]);
      }
    } catch (error) {
      console.error('画像処理エラー:', error);
      // ここでユーザーにエラーを通知する処理を追加
    }
  };

  const handleSubmit = () => {
    onSave(review.id, content, images);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[] h-[90vh] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">{review.parkName}のレビューを編集</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[calc(100%-8rem)]">
          <div className="flex-grow space-y-6 overflow-y-auto">
            {/* レビュー本文 */}
            <div className="flex flex-col flex-grow">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="公園の感想を書いてください（1000文字まで）"
                className="w-full min-h-[600px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                style={{ overflowY: 'auto' }}
              />
              <p className="text-sm text-muted-foreground text-right mt-2">
                {charCount}/{MAX_CHARS}文字
              </p>
            </div>

            {/* 写真アップロード部分 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">写真</h3>
              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <label className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      写真を選択
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*,.heic"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">最大5枚まで、各5MB以下</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {images.length === 0 ? '選択されていません' : `${images.length}枚選択中`}
                  </p>
                </div>
              </div>

              {/* 写真プレビュー */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full overflow-hidden rounded-md"
                    >
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <CardFooter className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit}>保存</Button>
          </CardFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
