'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ParkReviewProps {
  id: string;
  name: string;
  content: string;
  date: string;
  images: string[];
  likes: number;
  image?: string;
}

export function ParkReview({
  id,
  name,
  content,
  date,
  images,
  likes: initialLikes,
  image,
}: ParkReviewProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // レビューのいいね状態を取得
  useEffect(() => {
    if (session?.user) {
      fetchLikeStatus();
    }
  }, [session, id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}/likes`);
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
      }
    } catch (error) {
      console.error('いいね状態の取得に失敗しました', error);
    }
  };

  // いいねボタンのクリックハンドラ
  const handleLikeClick = async () => {
    if (!session?.user) {
      // ログインしていない場合はログインページへリダイレクト
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/${id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        // いいねの状態に応じていいね数を更新
        setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error('いいねの更新に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${name}のプロフィール画像`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`プロフィール画像の読み込みに失敗しました: ${image}`);
                e.currentTarget.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7nlLvpnaI8L3RleHQ+PC9zdmc+';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{name[0]}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>

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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLikeClick}
          disabled={isLoading}
          className={liked ? 'text-blue-500' : ''}
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="ml-2">{likes}</span>
        </Button>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </Card>
  );
}
