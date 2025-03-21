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

export function UserReviews({ reviews, isLoading = false }: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<null | (typeof reviews)[0]>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // 削除処理
  const handleDelete = async (reviewId: number) => {
    if (!confirm('このレビューを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レビューの削除に失敗しました');
      }

      // 成功したら一覧から削除（表示上の更新）
      // const updatedReviews = reviews.filter((review) => review.id !== reviewId);

      // ここで親コンポーネントに削除を通知する必要があります
      // この例では、親コンポーネントからonDeleteのようなコールバックが渡されていることを想定しています
      // もし渡されていない場合は、親コンポーネントを修正してコールバックを追加する必要があります
      // if (typeof onDelete === 'function') {
      //   onDelete(reviewId);
      // }

      // ページが空になった場合に前のページに戻る
      if (currentReviews.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('レビュー削除エラー:', error);
      alert(error instanceof Error ? error.message : '削除に失敗しました');
    }
  };

  // 編集処理
  const handleEdit = (reviewId: number) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setIsEditModalOpen(true);
    }
  };

  // 編集保存処理
  const handleSaveEdit = async (id: number, content: string) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レビューの更新に失敗しました');
      }

      // ここで親コンポーネントに更新を通知する必要があります
      // if (typeof onUpdate === 'function') {
      //   onUpdate(id, content);
      // }

      setIsEditModalOpen(false);
      setSelectedReview(null);
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
        {currentReviews.map((review) => (
          <Card key={review.id} className="p-4 relative">
            {/* 公園名 */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium md:text-lg">{review.parkName}</h3>

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
          onSave={handleSaveEdit} // 実装した保存ハンドラーを使用
        />
      )}
    </Card>
  );
}
