'use client';

import React from 'react';
import { Park } from '../types/park';
import { Card } from './ui/card';
import { MapPin, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { ERROR_MESSAGES } from '@/utils/errors';

/**
 * 検索結果のプロップス
 */
interface SearchResultsProps {
  parks: Park[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

/**
 * 検索結果
 * @param parks 公園リスト
 * @param isLoading ローディング状態
 * @param error エラー
 * @param hasSearched 検索実行済みフラグ
 */
export function SearchResults({ parks, isLoading, error, hasSearched }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            {/* 画像のスケルトン */}
            <Skeleton className="w-full h-48 rounded-md mb-4" />
            {/* タイトルのスケルトン */}
            <Skeleton className="h-6 w-3/4 mb-4" />
            {/* 情報行のスケルトン */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>エラー: {error}</p>
      </div>
    );
  }

  if (hasSearched && parks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{ERROR_MESSAGES.NO_RESULTS}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {parks.map((park) => (
        <Card key={park.place_id} className="p-4 hover:shadow-lg transition-shadow">
          {park.photos && park.photos[0] && (
            <Image
              src={`/api/photo?reference=${park.photos[0].photo_reference}`}
              alt={park.name}
              width={400}
              height={192}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="text-lg font-semibold mb-2">{park.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{park.vicinity}</span>
            </div>
            {park.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>
                  {park.rating} ({park.userRatingsTotal}件の評価)
                </span>
              </div>
            )}
            {park.openingHours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{park.openingHours.isOpen ? '営業中' : '休業中'}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
