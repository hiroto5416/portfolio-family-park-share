'use client';

import React, { useEffect, useState } from 'react';
import { ParkDetail } from '@/features/park/components/ParkDetail';
import { ParkReview } from '@/features/park/components/ParkReview';
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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

interface Review {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  profiles: {
    username: string;
  };
  review_images: {
    image_url: string;
  }[];
}

// APIレスポンスの型を定義
// interface ApiResponse {
//   success?: boolean;
//   review?: {
//     id: string;
//     content: string;
//     parkId: string;
//     userId: string;
//     createdAt: string;
//   };
//   error?: string;
//   details?: string;
// }

// const MOCK_REVIEWS = [
//   {
//     id: 1,
//     username: 'たなか',
//     content: 'とても広くて子供が喜んでいました！',
//     date: '2025-01-12',
//     images: ['/placeholder-review1.jpg', '/placeholder-review2.jpg'],
//   },
//   {
//     id: 2,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 3,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 4,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 5,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 6,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 7,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 8,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 9,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 10,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
//   {
//     id: 11,
//     username: '神宮寺',
//     content: '日影が多くて休憩できる場所も充実していて良かった。\nまた行きたいです!',
//     date: '2024-07-23',
//     images: ['/placeholder-review3.jpg'],
//   },
// ];

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!id) return;

    setIsLoadingReviews(true);
    setReviewError(null);

    try {
      console.log('Fetching reviews for park:', id);
      const response = await fetch(`/api/parks/${id}/reviews`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('レビュー取得サーバーエラー:', response.status, errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || 'レビューの取得に失敗しました');
        } catch (e) {
          throw new Error(`レビューの取得に失敗しました (${response.status})`);
        }
      }

      const data = await response.json();
      console.log('取得したレビューデータ:', data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('レビュー取得エラー:', error);
      setReviewError(error instanceof Error ? error.message : '不明なエラー');
    } finally {
      setIsLoadingReviews(false);
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
    fetchReviews();
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
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  // 現在のページに表示するレビューの取得
  const currentReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // ページ変更ハンドラー
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateReview = async (content: string, images: File[], formData: FormData) => {
    if (!session) {
      alert('レビューを投稿するにはログインが必要です');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData, // FormDataをそのまま送信
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'レビューの投稿に失敗しました');
      }

      setIsCreateModalOpen(false);
      alert('レビューを投稿しました');
      router.refresh();
    } catch (error) {
      console.error('レビュー投稿エラー:', error);
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

        {/* レビュー取得エラー表示 */}
        {reviewError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{reviewError}</p>
          </div>
        )}

        {/* レビュー読み込み中 */}
        {isLoadingReviews ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2">レビューを読み込み中...</p>
          </div>
        ) : (
          <>
            {/* レビュー一覧 */}
            {currentReviews.length > 0 ? (
              <div className="space-y-4">
                {currentReviews.map((review) => (
                  <ParkReview
                    key={review.id}
                    username={review.profiles.username}
                    content={review.content}
                    date={review.created_at}
                    images={review.review_images.map((img) => img.image_url)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                まだレビューがありません。最初のレビューを投稿してみましょう！
              </div>
            )}

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
          </>
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
