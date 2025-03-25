'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import heic2any from 'heic-convert';

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id: string;
    content: string;
    parkName: string;
    images: string[];
  };
  onSave: (id: string, content: string, newImages: File[], deletedImageUrls: string[]) => void;
}

// HEIC画像をJPEGに変換
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
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(review.images);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

      if (validFiles.length + newImages.length <= MAX_IMAGES) {
        setNewImages([...newImages, ...validFiles]);
      }
    } catch (error) {
      console.error('画像処理エラー:', error);
    }
  };

  // 既存の画像を削除
  const handleDeleteExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((url) => url !== imageUrl));
    setDeletedImageUrls([...deletedImageUrls, imageUrl]);
    if (selectedImage === imageUrl) {
      setSelectedImage(null);
    }
  };

  // 新しく具アップロードした画像を削除
  const handleDeleteNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // 画像をクリックしたときの処理
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSubmit = () => {
    onSave(review.id, content, newImages, deletedImageUrls);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-full max-w-4xl h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>{review.parkName}のレビューを編集</DialogTitle>
        </DialogHeader>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="公園の感想を書いてください（1000文字まで）"
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              style={{ height: '25vh' }}
            />
            <p className="text-sm text-muted-foreground text-right mt-2">
              {charCount}/{MAX_CHARS}文字
            </p>
            {/* 画像アップロード部分 */}
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
                    {existingImages.length + newImages.length === 0
                      ? '選択されていません'
                      : `${existingImages.length + newImages.length}枚選択中`}
                  </p>
                </div>
              </div>

              {/* 既存の画像プレビュー（サムネイル表示） */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">現在の画像</h4>
                  <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2">
                    {existingImages.map((imageUrl, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md cursor-pointer"
                        onClick={() => handleImageClick(imageUrl)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={`レビュー画像 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* 削除ボタン */}
                        <div
                          className="absolute top-0 right-0 p-0.5 bg-white rounded-full opacity-70 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExistingImage(imageUrl);
                          }}
                        >
                          <XCircle className="h-3 w-3 text-red-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 新しくアップロードした画像プレビュー（サムネイル表示） */}
              {newImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">新しい画像</h4>
                  <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2">
                    {newImages.map((image, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md cursor-pointer"
                        onClick={() => handleImageClick(URL.createObjectURL(image))}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`新しい画像 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* 削除ボタン */}
                        <div
                          className="absolute top-0 right-0 p-0.5 bg-white rounded-full opacity-70 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNewImage(index);
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
            <Button type="submit" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
