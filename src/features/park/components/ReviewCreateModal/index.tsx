import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, XCircle } from 'lucide-react';
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
    } catch (error) {
      console.error('HEIC変換エラー:', error);
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (selectedImage === URL.createObjectURL(images[index])) {
      setSelectedImage(null);
    }
  };

  const handleImageClick = (image: File) => {
    setSelectedImage(URL.createObjectURL(image));
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
        <div className="flex-1 overflow-y-auto pr-2">
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
              <div className="flex flex-wrap gap-3 mb-4">
                <div>
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
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">最大5枚まで、各5MB以下</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {images.length === 0 ? '選択されていません' : `${images.length}枚選択中`}
                  </p>
                </div>
              </div>

              {/* 画像プレビュー（サムネイル表示） */}
              {images.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2">
                    {images.map((image, index) => (
                      <div
                        key={`image-${index}`}
                        className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`プレビュー ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* 削除ボタン */}
                        <div
                          className="absolute top-0 right-0 p-0.5 bg-white rounded-full opacity-70 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(index);
                          }}
                        >
                          <XCircle className="h-3 w-3 text-red-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 画像拡大モーダル */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-3xl max-h-[80vh] p-4">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="bg-white p-2 rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="拡大画像"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}

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
