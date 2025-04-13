
/**
 * レビュー
 */
export interface Review {
  id: string;
  parkName: string;
  content: string;
  date: string;
  likes: number;
  images: string[];
}

/**
 * レビューフォームデータ
 */
export interface ReviewFormData {
  content: string;
  images: File[];
}

/**
 * レビューリストのプロップス
 */
export interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onReviewUpdated?: () => void;
}
