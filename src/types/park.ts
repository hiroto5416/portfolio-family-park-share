// Google Places APIのレスポンス型を定義
export interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  opening_hours?: {
    open_now: boolean;
    periods?: Array<{
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }>;
    weekday_text?: string[];
  };
}

// アプリケーション内で使用する公園データの型
export interface Park {
  place_id: string;
  name: string;
  vicinity: string; // 住所
  formatted_address?: string; // 追加
  location?: {
    lat: number;
    lng: number;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  // 追加するプロパティ
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: {
    isOpen: boolean;
  };
  // その他必要なプロパティ
}

// 検索結果の型
export interface SearchResult {
  parks: Park[];
  total: number;
  nextPageToken?: string;
}

// 検索パラメータの型
export interface SearchParams {
  query: string;
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number; // 検索半径（メートル）
}
