export interface Review {
  id: string;
  parkName: string;
  content: string;
  date: string;
  likes: number;
  images: string[];
}

export interface ReviewFormData {
  content: string;
  images: File[];
}

export interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onReviewUpdated?: () => void;
}
