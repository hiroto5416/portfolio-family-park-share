'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';

interface ReviewFormProps {
  parkName: string;
  onSubmit: (data: { content: string; images: File[] }) => void;
  onCancel: () => void;
}

export function ReviewForm({ parkName, onSubmit, onCancel }: ReviewFormProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length <= 5) {
      setImages([...images, ...files]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, images });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{parkName}</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col min-h-[600px]">
          <div className="flex-1 space-y-10">
            <div>
              <h2 className="text-xl font-semibold mb-4">レビューを投稿</h2>
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="公園の感想を書いてください（1000文字まで）"
                className="min-h-[200px] mb-2"
              />
              <p className="text-sm text-muted-foreground text-right">
                {charCount}/{MAX_CHARS}文字
              </p>
            </div>

            <div className='mt-8'>
              <h2 className="text-lg font-semibold mb-4">写真</h2>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  アップロード
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">最大5枚まで、各5MB以下</p>
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-md"
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

          <CardFooter className="flex justify-end border-t pt-6 gap-4">
            <Button variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" disabled={!content.trim()}>
              投稿する
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
