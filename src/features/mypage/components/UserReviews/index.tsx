'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { ReviewListProps } from '@/types/review';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReviewEditModal } from '../ReviewEditModal';

const REVIEWS_PER_PAGE = 5;

interface Review {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  park_id: string;
  parks: {
    id: string;
    name: string;
  };
  review_images: {
    id: string;
    image_url: string;
  }[];
}

export function UserReviews({ reviews, isLoading = false }: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<null | (typeof reviews)[0]>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ハンドラー関数
  // const handleEdit = (reviewId: number) => {
  //   console.log('編集:', reviewId);
  // };

  if (isLoading) {
    return <div className="text-center py-6">レビューを読み込み中...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">まだレビューがありません</p>
      </Card>
    );
  }

  const handleDelete = (reviewId: number) => {
    console.log('削除:', reviewId);
  };

  // 総ページ数
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

  const handleEdit = (reviewId: number) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setIsEditModalOpen(true);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">あなたのレビュー</h2>

      <div className="space-y-4">
        {currentReviews.map((review) => (
          <Card key={review.id} className="p-4 relative">
            {/* 公園名 */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium md:text-lg">{review.parkName}</h3>

              {/* モバイル用メニュー - 現状維持 */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(review.id)}>編集</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(review.id)}
                      className="text-destructive"
                    >
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* レビュー内容 */}
            <p className="text-muted-foreground mb-4">{review.content}</p>

            {/* いいね数と投稿日 */}
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likes}</span>
              </div>
              <span>{review.date}</span>
            </div>

            {/* デスクトップ用ボタン */}
            <div className="hidden md:flex justify-end gap-4">
              <Button variant="outline" size="sm" onClick={() => handleEdit(review.id)}>
                <Pencil className="h-4 w-4 mr-1" />
                編集
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          </Card>
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

      {selectedReview && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          onSave={(id, content) => {
            console.log('保存:', id, content);
            setIsEditModalOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </Card>
  );
}
