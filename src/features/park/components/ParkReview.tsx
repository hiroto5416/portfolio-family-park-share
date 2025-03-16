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
  images: string[];
}

export function ParkReview({ username, content, date, images }: ParkReviewProps) {
  useEffect(() => {
    // デバッグ用
    console.log('レビュー画像URL:', images);
  }, [images]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{username}</h3>

      <p className="whitespace-pre-line mb-4 text-muted-foreground">{content}</p>

      {images && images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto py-1">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-[80px] h-[80px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
            >
              <Image
                src={image}
                alt={`レビュー画像 ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
                onerror = null;
                blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7nlLvpnaI8L3RleHQ+PC9zdmc+';
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
