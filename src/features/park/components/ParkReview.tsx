'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface ParkReviewProps {
  username: string;
  content: string;
  date: string;
  images: { image_url: string }[] | string[]; // 両方の形式に対応
}

export function ParkReview({ username, content, date, images }: ParkReviewProps) {
  useEffect(() => {
    // デバッグ用
    console.log('レビュー画像URL:', images);
  }, [images]);

  // 画像URLを正規化する関数
  const normalizeImageUrl = (image: any): string => {
    if (typeof image === 'string') return image;
    if (image && image.image_url) return image.image_url;
    return '';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{username}</h3>

      <p className="whitespace-pre-line mb-4 text-muted-foreground">{content}</p>

      {images && images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto py-1">
          {images.map((image, index) => {
            const imageUrl = normalizeImageUrl(image);
            if (!imageUrl) return null;

            return (
              <div
                key={index}
                className="relative w-[80px] h-[80px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
              >
                <Image
                  src={imageUrl}
                  alt={`レビュー画像 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => {
                    console.error(`画像の読み込みに失敗しました: ${imageUrl}`);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button variant="ghost" size="icon">
          <ThumbsUp className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </Card>
  );
}
