'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { ReviewListProps } from '@/types/review';
import { ReviewEditModal as ImportedReviewEditModal } from '../ReviewEditModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

/**
 * レビューのページ数
 */
const REVIEWS_PER_PAGE = 5;

/**
 * ユーザーのレビュー
 * @param reviews レビューリスト
 * @param isLoading ローディング状態
 * @param onReviewUpdated レビュー更新時のコールバック
 */
export function UserReviews({ reviews, isLoading = false, onReviewUpdated }: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<null | (typeof reviews)[0]>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

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

  // 削除ボタンクリック時
  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  // 削除処理
  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await fetch(`/api/reviews/${reviewToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レビューの削除に失敗しました');
      }

      // モーダルを閉じる
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);

      // レビュー一覧を更新
      if (onReviewUpdated) {
        onReviewUpdated();
      }

      // 成功メッセージを表示
      alert('レビューを削除しました');
    } catch (error) {
      console.error('レビュー削除エラー:', error);
      alert(error instanceof Error ? error.message : '削除に失敗しました');
    }
  };

  // モーダルを閉じる処理
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  // 編集処理を修正
  const handleEdit = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);

    if (review) {
      setSelectedReview(review);
      setIsEditModalOpen(true);
    } else {
      console.error('レビューが見つかりませんでした');
    }
  };

  // 編集保存処理
  const handleSaveEdit = async (
    id: string,
    content: string,
    newImages: File[],
    deletedImageUrls: string[]
  ) => {
    try {
      // formDataを使用して画像とテキストデータを送信
      const formData = new FormData();
      formData.append('content', content);

      // 削除する画像URLのリスト
      if (deletedImageUrls.length > 0) {
        deletedImageUrls.forEach((url, index) => {
          formData.append(`deletedImages[${index}]`, url);
        });
      }

      // 新しい画像のアップロード
      if (newImages.length > 0) {
        newImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レビューの更新に失敗しました');
      }

      setIsEditModalOpen(false);
      setSelectedReview(null);

      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error) {
      console.error('レビュー更新エラー:', error);
      alert(error instanceof Error ? error.message : '更新に失敗しました');
    }
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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">あなたのレビュー</h2>
      <div className="space-y-4">
        {currentReviews.map((review, index) => (
          <Card key={`review-${review.id || index}`} className="p-4 relative">
            {/* 公園名 */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium md:text-lg">{review.parkName}</h3>

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
                  onClick={() => handleDeleteClick(review.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  削除
                </Button>
              </div>

              {/* モバイル用メニュー */}
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
                      onClick={() => handleDeleteClick(review.id)}
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

            {/* 画像の表示 */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 overflow-hidden">
                {review.images.map((imageUrl, index) => (
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

            {/* いいね数と投稿日 */}
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likes}</span>
              </div>
              <span>{review.date}</span>
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
        <ImportedReviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          onSave={handleSaveEdit}
        />
      )}

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
}
