'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Libraries } from '@googlemaps/js-api-loader';

// Google Maps の「places」ライブラリを使用することを宣言
const libraries: Libraries = ['places'];

interface Park {
  name: string; // 公園名
  location: {
    lat: number; // 緯度
    lng: number; // 経度
  };
}

export function GoogleMapComponent() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [parks, setParks] = useState<Park[]>([]);

  // Google Maps APIの読み込み
  const { isLoaded } = useLoadScript({
    // Google CloudプラットフォームでAPIキーを取得し、環境変数に設定
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    // 使用するGoogle Maps APIのライブラリを指定（places）
    libraries: libraries,
  });

  useEffect(() => {
    // 現在地を取得
    if (navigator.geolocation) {
      // ユーザーの位置情報を取得
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 取得成功時
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // 取得失敗時
          console.error('位置情報の取得に失敗しました');
          // デフォルトの位置（東京駅）
          setCurrentLocation({
            lat: 35.6812362,
            lng: 139.7671248,
          });
        }
      );
    }
  }, []);

  // 近くの公園を取得
  const fetchNearbyParks = useCallback(async () => {
    if (!currentLocation) return;

    try {
      // 現在の位置の軽度・緯度をパラメータとして、APIリクエストを送信
      const response = await fetch(
        `/api/places?lat=${currentLocation.lat}&lng=${currentLocation.lng}`
      );
      const data = await response.json();
      setParks(data.parks);
    } catch (error) {
      console.error('公園の取得に失敗しました:', error);
    }
  }, [currentLocation]);

  // 現在の位置が変更された際に、近くの公園を取得
  useEffect(() => {
    if (currentLocation) {
      fetchNearbyParks();
    }
  }, [currentLocation, fetchNearbyParks]);

  if (!isLoaded) return <div>地図を読み込み中...</div>;

  return (
    <GoogleMap
      zoom={14}
      center={currentLocation || { lat: 35.6812362, lng: 139.7671248 }}
      mapContainerClassName="w-full h-[500px] rounded-lg"
    >
      {parks.map((park, index) => (
        <MarkerF key={index} position={park.location} title={park.name} />
      ))}
    </GoogleMap>
  );
}
