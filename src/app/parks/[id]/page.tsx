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
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

// APIレスポンスの型を定義
interface ApiResponse {
  success?: boolean;
  review?: {
    id: string;
    content: string;
    parkId: string;
    userId: string;
    createdAt: string;
  };
  error?: string;
  details?: string;
}

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
  const { data: session } = useSession();
  const router = useRouter();

  const [parkData, setParkData] = useState<ParkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

        // 公園データをデータベースに保存
        // const saveResponse = await fetch('/api/parks', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     place_id: id,
        //     name: data.park.name,
        //     address: data.park.address || '',
        //   }),
        // });
        // const saveResponse = await fetch('/api/parks', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     placeId: id,  // place_id から placeId に変更
        //     name: data.park.name,
        //     address: data.park.address || '',
        //   }),
        // });

        const saveResponse = await fetch('/api/parks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            place_id: id, // placeIdではなくplace_idを使用
            name: data.park.name,
            address: data.park.address || '',
          }),
        });

        if (!saveResponse.ok) {
          console.error('公園データの保存に失敗:', await saveResponse.text());
        }

        setParkData(data.park);
      } catch (error) {
        console.error('Error:', error);
        setError('公園情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchParkData();
  }, [id, params]);

  // ローディング状態の表示
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
    if (!session) {
      alert('レビューを投稿するにはログインが必要です');
      router.push('/login');
      return;
    }

    try {
      // リクエストの前にデータをログに出力して確認
      console.log('送信するデータ:', { content, parkId: id });

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parkId: id,
        }),
      });

      // ステータスコードをログに記録
      console.log('レスポンスステータス:', response.status);

      // レスポンス処理の改善
      let data: ApiResponse = {}; // 型を明示的に指定
      let responseText = '';

      try {
        responseText = await response.text();
        console.log('生のレスポンス:', responseText);

        if (responseText) {
          data = JSON.parse(responseText) as ApiResponse; // 型アサーションを追加
        }
      } catch (parseError) {
        console.error('JSONパースエラー:', parseError);
        console.error('パース対象のテキスト:', responseText);
        alert('サーバーからの応答を解析できませんでした');
        return;
      }

      if (!response.ok) {
        const errorMessage = data.error || data.details || `エラー: ${response.status}`;
        console.error('APIエラー:', errorMessage, data);
        alert(errorMessage);
        return;
      }

      // 成功時の処理
      setIsCreateModalOpen(false);
      alert('レビューを投稿しました');
      router.refresh();
    } catch (error) {
      // より詳細なエラーログ
      console.error('レビュー投稿エラー:', error);
      if (error instanceof Error) {
        console.error('エラータイプ:', error.name);
        console.error('エラーメッセージ:', error.message);
        console.error('スタックトレース:', error.stack);
      }

      alert(error instanceof Error ? error.message : 'レビューの投稿に失敗しました');
    }
  };
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
          parkId={id}
          onSubmit={handleCreateReview}
        />
      </div>
    </div>
  );
}
