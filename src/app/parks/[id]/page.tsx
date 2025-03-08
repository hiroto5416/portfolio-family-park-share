'use client';

import React, { useEffect, useState } from 'react';
import { ParkDetail } from '@/features/park/components/ParkDetail';
import { ParkReview } from '@/features/park/components/ParkReview';
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
// import Link from 'next/link';
// import { ReviewEditModal } from '@/features/mypage/components/ReviewEditModal';
import { ReviewCreateModal } from '@/features/park/components/ReviewCreateModal';
import { useParams } from 'next/navigation';

const REVIEWS_PER_PAGE = 5;

interface ParkData {
  name: string;
  images: string[];
  address: string;
  hours: string;
  facilities: string[];
  photos: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  businessStatus: string;
}

// ダミーデータ
// const parkData = {
//   id: '1',
//   name: '中央公園',
//   address: '東京都新宿区西新宿',
//   hours: '24時間',
//   facilities: [
//     '遊具',
//     'ベンチ',
//     'トイレ',
//     '駐車場',
//     '災害支援サイン',
//     '全天候型バーゴラ',
//     'シェルター',
//     'テーブルセット',
//     '水飲み',
//   ],
//   images: ['/placeholder-park.jpg'],
// };

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
  const params = useParams();
  const id = params?.id as string;

  const [parkData, setParkData] = useState<ParkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // ページネーション用のステート
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedReview, setSelectedReview] = useState<null | (typeof reviews)[0]>(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleCreateReview = async (content: string, images: File[]) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('parkId', id);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レビューの投稿に失敗しました');
      }

      setIsCreateModalOpen(false);
      // TODO: 成功時の処理を追加
      // 例: レビュー一覧の再取得など
    } catch (error) {
      console.error('レビュー投稿エラー:', error);
      alert(error instanceof Error ? error.message : 'レビューの投稿に失敗しました');
    }
  };

  useEffect(() => {
    const fetchParkData = async () => {
      if (!id) {
        console.error('ID is undefined:', params);
        setError('公園IDが見つかりません');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching park with ID:', id);
        const response = await fetch(`/api/parks/${id}`);

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received park data:', data);

        if (data.error) {
          setError(data.error);
        } else {
          setParkData(data.park);
        }
      } catch (err) {
        console.error('Error fetching park:', err);
        setError('公園情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchParkData();
  }, [id, params]);

  // ローディング状態の表示を改善
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  // エラー表示を改善
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">エラー: {error}</div>
      </div>
    );
  }

  // データが存在しない場合の表示を改善
  if (!parkData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">公園が見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{parkData.name}</h1>

      {/* 上部セクション: 写真と情報を横並びに */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 左側: 公園写真 */}
        <div className="order-1 md:order-1">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">公園写真</p>
            </div>
            <div className="flex justify-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md h-[250px] max-w-fit">
                <Image
                  loader={({ src }) => src}
                  src={`/api/photo?reference=${parkData.photos[0].photo_reference}`}
                  alt={parkData.name}
                  className="object-cover"
                  width={533}
                  height={400}
                  unoptimized
                />
              </div>
            </div>
          </Card>
        </div>

        {/* 右側: 公園情報 */}
        <div className="order-2 md:order-2 h-full">
          <div className="h-full max-h-[340px] overflow-auto">
            <ParkDetail
              name={parkData.name}
              address={parkData.address}
              hours={parkData.hours}
              facilities={parkData.facilities}
              images={parkData.images}
              businessStatus={parkData.businessStatus}
            />
          </div>
        </div>
      </div>

      {/* 下部セクション: レビュー */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">レビュー</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>レビューを書く</Button>
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

        <ReviewCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          parkName={parkData.name}
          onSubmit={handleCreateReview}
        />
      </div>
    </div>
  );
}
