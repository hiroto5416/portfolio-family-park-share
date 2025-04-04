'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Park } from '@/types/park';
import Link from 'next/link';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LocationWarning } from '@/components/LocationWarning';

// 画像ローダーを定義することで、外部URLでもNext.js Imageコンポーネントを使用できるようにする
const googlePlacesLoader = ({ src, width }: { src: string; width: number }) => {
  // 相対パスの場合は絶対パスに変換
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = src.startsWith('/') ? `${baseUrl}${src}` : src;
  const url = new URL(fullUrl);
  const reference = url.searchParams.get('reference');
  return `/api/photo?reference=${reference}&width=${width}`;
};

export function ParkList() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { location, error, isDefaultLocation } = useGeolocation();

  React.useEffect(() => {
    if (location) {
      fetchParks(location.lat, location.lng);
    }
  }, [location]);

  const fetchParks = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        console.error('公園データ取得エラー:', data.error);
      } else {
        setParks(data.parks);
      }
    } catch (err) {
      console.error('公園データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  return (
    <div className="relative">
      <div className="space-y-2">
        {parks.length === 0 ? (
          <div className="text-center py-4">
            {isDefaultLocation
              ? '東京駅周辺の公園が見つかりませんでした'
              : '近くの公園が見つかりませんでした'}
          </div>
        ) : (
          parks.map((park, index) => (
            <Link
              key={index}
              href={`/parks/${park.place_id}`}
              className="block bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4 p-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  {park.photos && park.photos[0] && !imageErrors[park.place_id] ? (
                    <Image
                      src={`/api/photo?reference=${encodeURIComponent(park.photos[0].photo_reference)}`}
                      alt={park.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-md"
                      loader={googlePlacesLoader}
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [park.place_id]: true }));
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">{park.name}</h3>
                  {park.vicinity && (
                    <p className="text-sm text-gray-500 truncate mt-1">{park.vicinity}</p>
                  )}
                  {park.rating && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="mr-1">★</span>
                      <span>{park.rating}</span>
                      {park.userRatingsTotal && (
                        <span className="ml-1">({park.userRatingsTotal}件)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      {error && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <LocationWarning message={error} isDefaultLocation={isDefaultLocation} />
        </div>
      )}
    </div>
  );
}
