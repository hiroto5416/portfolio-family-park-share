import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import heic2any from 'heic-convert';

interface ReviewCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkName: string;
  parkId: string;
  onSubmit: (content: string, images: File[], formData: FormData) => Promise<void>;
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
    } catch {
      throw new Error('画像の変換に失敗しました');
    }
  }
  return file;
};

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
  const MAX_CHARS = 1000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGES = 5;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!content.trim()) {
        alert('レビュー内容を入力してください');
        return;
      }

      const formData = new FormData();
      formData.append('content', content);
      formData.append('parkId', parkId);

      images.forEach((image) => {
        formData.append('images', image);
      });

      await onSubmit(content, images, formData);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'レビューの投稿に失敗しました');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-full max-w-4xl h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>{parkName}のレビューを書く</DialogTitle>
        </DialogHeader>

        {/* メインコンテンツ部分 - スクロール可能 */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="公園の感想を書いてください（1000文字まで）"
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              style={{ height: '30vh' }}
            />
            <p className="text-sm text-muted-foreground text-right mt-2">
              {charCount}/{MAX_CHARS}文字
            </p>

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
        </div>

        {/* フッター部分 - 下部に固定 */}
        <div className="mt-auto pt-4 border-t">
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={!content.trim()} onClick={handleSubmit}>
              投稿する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
