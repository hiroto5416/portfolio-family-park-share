'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import React, { useEffect } from 'react';

interface ParkReviewProps {
  name: string;
  content: string;
  date: string;
  images: string[]; // 型を簡略化
}

export function ParkReview({ name, content, date, images }: ParkReviewProps) {
  useEffect(() => {
    console.log('レビュー画像URL:', images);
  }, [images]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>

      <p className="whitespace-pre-line mb-4 text-muted-foreground">{content}</p>

      {/* 画像表示セクション */}
      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 overflow-hidden">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
              style={{ maxWidth: '80px', maxHeight: '80px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`レビュー画像 ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error(`画像の読み込みに失敗しました: ${imageUrl}`);
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7nlLvpnaI8L3RleHQ+PC9zdmc+';
                }}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          ))}
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
