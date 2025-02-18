'use client';

import React, { useState } from 'react';
import { ParkDetail } from '@/features/park/components/ParkDetail';
import { ParkReview } from '@/features/park/components/ParkReview';
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const REVIEWS_PER_PAGE = 5;

// ダミーデータ
const MOCK_PARK_DATA = {
  id: '1',
  name: '中央公園',
  address: '東京都新宿区西新宿',
  hours: '24時間',
  facilities: ['遊具', 'ベンチ', 'トイレ','駐車場', '災害支援サイン', '全天候型バーゴラ','シェルター','テーブルセット','水飲み'],
  images: ['/placeholder-park.jpg'],
};

const MOCK_REVIEWS = [
  {
    id: 1,
    username: 'たなか',
    content: 'とても広くて子供が喜んでいました！',
    date: '2025-01-12',
    images: ['/placeholder-review1.jpg', '/placeholder-review2.jpg'],
  },
  {
    id: 2,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 3,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 4,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 5,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 6,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 7,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 8,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 9,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 10,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
  {
    id: 11,
    username: '神宮寺',
    content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
    date: '2024-07-23',
    images: ['/placeholder-review3.jpg'],
  },
];

export default function ParkDetailPage() {
  // ページネーション用のステート
  const [currentPage, setCurrentPage] = useState(1);

  // 総ページ数を計算
  const totalPages = Math.ceil(MOCK_REVIEWS.length / REVIEWS_PER_PAGE);

  // 現在のページに表示するレビューの取得
  const currentReviews = MOCK_REVIEWS.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // ページ変更ハンドラー
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{MOCK_PARK_DATA.name}</h1>

      {/* 上部セクション: 写真と情報を横並びに */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 左側: 公園写真 */}
        <div className="order-1 md:order-1">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">公園写真</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md h-[250px]">
              <Image
                src={MOCK_PARK_DATA.images[0]}
                alt={MOCK_PARK_DATA.name}
                className="object-cover w-full h-full"
                width={10}
                height={10}
              />
            </div>
          </Card>
        </div>

        {/* 右側: 公園情報 */}
        <div className="order-2 md:order-2 h-full">
          <div className='h-full max-h-[340px] overflow-auto'>
            <ParkDetail {...MOCK_PARK_DATA} />
          </div>
        </div>
      </div>

      {/* 下部セクション: レビュー */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">レビュー</h2>
          <Button asChild>
            <Link href={`/parks/${MOCK_PARK_DATA.id}/review`}>レビューを書く</Link>
          </Button>
        </div>

        {/* レビュー一覧 */}
        <div className="space-y-4">
          {currentReviews.map((review) => (
            <ParkReview key={review.id} {...review} />
          ))}
        </div>

        {/* ページネーションUI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              前へ
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              次へ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
