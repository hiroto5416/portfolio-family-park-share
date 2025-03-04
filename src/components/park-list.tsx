'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Park } from '@/types/park';

// 画像ローダーを定義することで、外部URLでもNext.js Imageコンポーネントを使用できるようにする
const googlePlacesLoader = ({ src }: { src: string }) => {
  return src;
};

export function ParkList() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`/api/places?lat=${latitude}&lng=${longitude}`);

          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }

          const data = await response.json();

          if (data.error) {
            setError(data.error);
          } else {
            console.log('取得した公園データ:', data.parks);
            setParks(data.parks);
          }
        } catch (err) {
          console.error('公園データ取得エラー:', err);
          setError('公園の検索に失敗しました');
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        console.error('位置情報エラー:', geoErr);
        setError('位置情報の取得に失敗しました');
        setLoading(false);
      }
    );
  }, []);

  const handleImageError = (parkId: string | number) => {
    console.log(`画像読み込みエラー (park ID: ${parkId})`);
    setImageErrors((prev) => ({ ...prev, [parkId]: true }));
  };

  // 安全なURL生成と参照チェック
  const getPhotoUrl = (photoReference: string) => {
    if (!photoReference) return '';
    try {
      return `/api/photo?reference=${encodeURIComponent(photoReference)}`;
    } catch (e) {
      console.error('Photo reference encoding error:', e);
      return '';
    }
  };

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (parks.length === 0)
    return <div className="text-center py-4">近くに公園が見つかりませんでした</div>;

  return (
    <div className="space-y-4">
      {parks.map((park, index) => {
        const parkId = park.place_id || `park-${index}`;
        const hasImageError = imageErrors[parkId];
        const photoReference = park.photos?.[0]?.photo_reference;
        
        // 参照IDのデバッグ (開発環境のみ)
        if (process.env.NODE_ENV === 'development' && photoReference) {
          console.log(`Park ${park.name} photo ref: ${photoReference.substring(0, 15)}...`);
        }

        return (
          <div
            key={parkId}
            className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {photoReference && !hasImageError ? (
                <Image
                  loader={googlePlacesLoader}
                  src={getPhotoUrl(photoReference)}
                  alt={park.name}
                  width={64}
                  height={64}
                  className="object-cover h-full w-full"
                  onError={() => handleImageError(parkId)}
                  unoptimized // 重要: Next.jsの最適化をバイパスして元の画像を表示
                />
              ) : (
                <span className="text-xs text-gray-500">No Image</span>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{park.name}</h4>
              <p className="text-sm text-gray-500 truncate">{park.vicinity}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}