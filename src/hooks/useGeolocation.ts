import { useState, useEffect } from 'react';

interface GeolocationState {
  location: {
    lat: number;
    lng: number;
  } | null;
  error: string | null;
  isLocationServiceEnabled: boolean;
}

// デフォルトの位置（東京駅）
const DEFAULT_LOCATION = {
  lat: 35.6812362,
  lng: 139.7671248,
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLocationServiceEnabled: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: '位置情報サービスがお使いのブラウザでサポートされていません。',
        location: DEFAULT_LOCATION,
        isLocationServiceEnabled: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          isLocationServiceEnabled: true,
        }));
      },
      () => {
        const errorMessage =
          '位置情報サービスがオフになっています。\n位置情報をオンにすると、あなたの近くの公園を表示できます。';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          location: DEFAULT_LOCATION,
          isLocationServiceEnabled: false,
        }));
      }
    );
  }, []);

  return {
    ...state,
    defaultLocation: DEFAULT_LOCATION,
    isDefaultLocation: state.location === DEFAULT_LOCATION,
  };
};
