'use client';

import React, { useEffect, useState } from 'react';
import { ParkCard } from './park-card';

// APIレスポンスの型定義
interface ParkApiResponse {
  business_status: string;
  name: string;
  vicinity: string;
  user_ratings_total: number;
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }[];
  location: {
    lat: number;
    lng: number;
  };
}

export const TestPlaces = () => {
  const [parks, setParks] = useState<ParkApiResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`/api/places?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();

          if (data.error) {
            setError(data.error);
          } else {
            setParks(data.parks);
          }
        } catch (err) {
          setError('公園の検索に失敗しました' + err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('位置情報の取得に失敗しました');
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">近くの公園</h2>
      <div>
        {parks?.map((park, index) => (
          <ParkCard
            key={index}
            name={park.name}
            address={park.vicinity}
            reviewCount={park.user_ratings_total}
            location={{
              lat: park.location.lat,
              lng: park.location.lng,
            }}
            // 写真がある場合は最初の写真のreferenceを使用
            photoReference={park.photos?.[0]?.photo_reference}
          />
        ))}
      </div>
    </div>
  );
};
