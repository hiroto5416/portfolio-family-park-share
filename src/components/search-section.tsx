'use client';

import { SearchBar } from './search-bar';
import { useSearchContext } from '@/contexts/SearchContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// 画像ローダーを定義することで、外部URLでもNext.js Imageコンポーネントを使用できるようにする
const googlePlacesLoader = ({ src, width }: { src: string; width: number }) => {
  // 相対パスの場合は絶対パスに変換
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = src.startsWith('/') ? `${baseUrl}${src}` : src;
  const url = new URL(fullUrl);
  const reference = url.searchParams.get('reference');
  return `/api/photo?reference=${reference}&width=${width}`;
};

export function SearchSection() {
  const { results, isLoading, error } = useSearchContext();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // 画像エラーハンドリング
  const handleImageError = (parkId: string) => {
    setImageErrors((prev) => ({ ...prev, [parkId]: true }));
  };

  // 写真URLの生成
  const getPhotoUrl = (photoReference: string) => {
    if (!photoReference) return '';
    try {
      return `/api/photo?reference=${encodeURIComponent(photoReference)}`;
    } catch (e) {
      console.error('Photo reference encoding error:', e);
      return '';
    }
  };

  // 住所フォーマット
  const formatAddress = (address: string) => {
    return address?.replace(/^日本、〒\d{3}-\d{4}\s*/, '');
  };

  return (
    <div className="w-full">
      <SearchBar />
      <div className="mt-4">
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          </div>
        )}

        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        {!isLoading && !error && results.length > 0 && (
          <div className="space-y-1.5 bg-green-50">
            {results.slice(0, 5).map((park) => {
              const parkId = park.place_id;
              const hasImageError = imageErrors[parkId];
              const photoReference = park.photos?.[0]?.photo_reference;

              return (
                <Link
                  href={`/parks/${encodeURIComponent(parkId)}`}
                  key={parkId}
                  className="block hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3 p-3 cursor-pointer border-b border-gray-200 last:border-b-0">
                    <div className="h-14 w-14 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {photoReference && !hasImageError ? (
                        <Image
                          loader={googlePlacesLoader}
                          src={getPhotoUrl(photoReference)}
                          alt={park.name}
                          width={56}
                          height={56}
                          sizes="56px"
                          className="object-cover h-full w-full"
                          onError={() => handleImageError(parkId)}
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{park.name}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {formatAddress(park.formatted_address || park.vicinity || '')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
