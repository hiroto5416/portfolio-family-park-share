import { Park, SearchResult, SearchParams } from '../types/park';
import { GooglePlace } from '../types/google-places';

export class ParkSearchService {
  private baseUrl = '/api/search'; // ローカルのAPIエンドポイントに変更

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

      console.log('検索リクエストURL:', `${this.baseUrl}?${queryParams}`); // リクエストURLの確認

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      const data = await response.json();

      console.log('APIレスポンス:', data); // レスポンスデータの確認

      if (!response.ok) {
        throw new Error(data.error || '検索に失敗しました');
      }

      const result = {
        parks: data.results.map((place) => this.transformPlaceToPark(place)),
        total: data.results.length,
        nextPageToken: data.next_page_token,
      };

      console.log('変換後の結果:', result); // 変換後のデータ確認
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
        parks: data.results.map((place) => this.transformPlaceToPark(place)),
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
    const baseUrl = this.baseUrl;
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: place.photos?.map(
        (photo) => `${baseUrl}/photo?maxwidth=400&photo_reference=${photo.photo_reference}`
      ),
      openingHours: place.opening_hours
        ? {
            isOpen: place.opening_hours.open_now || false,
            periods: place.opening_hours.periods || [],
          }
        : undefined,
      facilities: place.types,
    };
  }
}

// シングルトンインスタンスのエクスポート
export const parkSearchService = new ParkSearchService();
