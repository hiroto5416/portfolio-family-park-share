export interface Park {
  id: string; // Google Places APIのplace_id
  name: string; // 公園名
  address: string; // 住所
  location: {
    lat: number; // 緯度
    lng: number; // 経度
  };
  rating?: number; // 評価（オプション）
  userRatingsTotal?: number; // 評価数（オプション）
  photos?: string[]; // 写真URL（オプション）
  openingHours?: {
    isOpen: boolean;
    periods?: {
      open: string;
      close: string;
    }[];
  };
  facilities?: string[]; // 施設情報（オプション）
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
