import { Park, SearchResult, SearchParams, GooglePlace } from '../types/park';

export class ParkSearchService {
  private baseUrl = '/api/search';

  // テキスト検索
  async searchByText(params: SearchParams): Promise<SearchResult> {
    try {
      const queryParams = new URLSearchParams({
        query: params.query,
        ...(params.location && {
          lat: params.location.lat.toString(),
          lng: params.location.lng.toString(),
          radius: (params.radius || 5000).toString(),
        }),
      });

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '検索に失敗しました');
      }

      // データの存在確認を追加
      if (!data.results || !Array.isArray(data.results)) {
        return {
          parks: [],
          total: 0,
        };
      }

      const result = {
        parks: data.results
          .filter((place: GooglePlace) => place && place.place_id)
          .map((place: GooglePlace) => this.transformPlaceToPark(place)),
        total: data.results.length,
        nextPageToken: data.next_page_token,
      };

      return result;
    } catch (error) {
      console.error('公園検索エラー:', error);
      throw error;
    }
  }

  // 位置情報による検索
  async searchByLocation(lat: number, lng: number): Promise<SearchResult> {
    try {
      const queryParams = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: '5000',
        type: 'park',
        language: 'ja',
      });

      const response = await fetch(`${this.baseUrl}/nearbysearch/json?${queryParams}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(data.error_message || '検索に失敗しました');
      }

      return {
        parks: data.results.map((place: GooglePlace) => this.transformPlaceToPark(place)),
        total: data.results.length,
        nextPageToken: data.next_page_token,
      };
    } catch (error) {
      console.error('位置情報検索エラー:', error);
      throw error;
    }
  }

  // Google Places APIのレスポンスをPark型に変換
  private transformPlaceToPark(place: GooglePlace): Park {
    return {
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity || '',
      formatted_address: place.formatted_address || place.vicinity || '',
      location: place.geometry?.location
        ? {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }
        : undefined,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: place.photos?.map((photo) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
      })),
    };
  }
}

// シングルトンインスタンスのエクスポート
export const parkSearchService = new ParkSearchService();
