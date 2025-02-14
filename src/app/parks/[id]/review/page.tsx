'use client';

import { ReviewForm } from '@/features/park/components/ReviewForm';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ReviewPage() {
  const router = useRouter();

  const handleSubmit = (data: { content: string; images: File[] }) => {
    console.log('Submit', data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <ReviewForm parkName="中央公園" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
