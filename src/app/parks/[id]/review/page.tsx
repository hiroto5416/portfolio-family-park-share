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
    <div className="flex flex-col flex-grow">
      <div className="container max-w-5xl mx-auto py-6 md:py-12 px-4 flex flex-col flex-grow">
        <ReviewForm parkName="中央公園" onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
