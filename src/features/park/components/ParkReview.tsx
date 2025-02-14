'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface ParkReviewProps {
  username: string;
  content: string;
  date: string;
  images: string[];
}

export function ParkReview({ username, content, date, images }: ParkReviewProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{username}</h3>

      <p className="whitespace-pre-line mb-4 text-muted-foreground">{content}</p>

      {images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-md"
            >
              <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
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
