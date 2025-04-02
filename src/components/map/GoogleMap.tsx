'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Libraries } from '@googlemaps/js-api-loader';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LocationWarning } from '@/components/LocationWarning';

// Google Maps の「places」ライブラリを使用することを宣言
const libraries: Libraries = ['places'];

interface Park {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

export function GoogleMapComponent() {
  const [parks, setParks] = useState<Park[]>([]);
  const { location, error, isDefaultLocation } = useGeolocation();

  // Google Maps APIの読み込み
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  });

  useEffect(() => {
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
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative h-[500px]">
      <div className="absolute inset-0">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={14}
          center={location || undefined}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {location && (
            <MarkerF
              position={location}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          )}
          {parks.map((park, index) => (
            <MarkerF key={index} position={park.location} title={park.name} />
          ))}
        </GoogleMap>
      </div>
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <LocationWarning message={error} isDefaultLocation={isDefaultLocation} />
        </div>
      )}
    </div>
  );
}
