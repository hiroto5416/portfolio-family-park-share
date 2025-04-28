import { Park, SearchResult, SearchParams, GooglePlace } from '../types/park';
import { ParkSearchError, ERROR_CODES, HTTP_STATUS_TO_ERROR_CODE } from '../utils/errors';

/**
 * 公園検索サービス
 */
export class ParkSearchService {
  private baseUrl = '/api/search';

  /**
   * テキスト検索
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  async searchByText(params: SearchParams): Promise<SearchResult> {
    try {
      // 入力検証
      if (!params.query?.trim()) {
        throw new ParkSearchError('検索キーワードを入力してください', ERROR_CODES.INVALID_QUERY);
      }

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
        const errorCode = HTTP_STATUS_TO_ERROR_CODE[response.status] || ERROR_CODES.API_ERROR;
        throw new ParkSearchError(data.error || '検索に失敗しました', errorCode, response.status);
      }

      // データの存在確認を追加
      if (!data.results || !Array.isArray(data.results)) {
        return {
          parks: [],
          total: 0,
        };
      }

      const parks = data.results
        .filter((place: GooglePlace) => place && place.place_id)
        .map((place: GooglePlace) => this.transformPlaceToPark(place));

      // 検索結果が0件の場合
      if (parks.length === 0) {
        throw new ParkSearchError('検索結果が見つかりませんでした', ERROR_CODES.NO_RESULTS);
      }

      const result = {
        parks,
        total: data.results.length,
        nextPageToken: data.next_page_token,
      };

      return result;
    } catch (error) {
      console.error('公園検索エラー:', error);

      // すでにParkSearchErrorならそのまま投げる
      if (error instanceof ParkSearchError) {
        throw error;
      }

      // ネットワークエラーの処理
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ParkSearchError('ネットワークエラーが発生しました', ERROR_CODES.NETWORK_ERROR);
      }

      // その他のエラー
      throw new ParkSearchError(
        error instanceof Error ? error.message : '検索に失敗しました',
        ERROR_CODES.UNKNOWN_ERROR
      );
    }
  }

  /**
   * 位置情報による検索
   * @param lat 緯度
   * @param lng 経度
   * @returns 検索結果
   */
  async searchByLocation(lat: number, lng: number): Promise<SearchResult> {
    try {
      // 入力検証
      if (isNaN(lat) || isNaN(lng)) {
        throw new ParkSearchError('位置情報が無効です', ERROR_CODES.LOCATION_ERROR);
      }

      const queryParams = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: '5000',
        type: 'park',
        language: 'ja',
      });

      const response = await fetch(`${this.baseUrl}/nearbysearch/json?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        const errorCode = HTTP_STATUS_TO_ERROR_CODE[response.status] || ERROR_CODES.API_ERROR;
        throw new ParkSearchError(
          data.error_message || '検索に失敗しました',
          errorCode,
          response.status
        );
      }

      if (data.status !== 'OK') {
        // Google Places APIのステータスコードに基づいてエラーコードを設定
        let errorCode: keyof typeof ERROR_CODES = ERROR_CODES.API_ERROR;

        switch (data.status) {
          case 'ZERO_RESULTS':
            errorCode = ERROR_CODES.NO_RESULTS;
            break;
          case 'INVALID_REQUEST':
            errorCode = ERROR_CODES.VALIDATION_ERROR;
            break;
          case 'OVER_QUERY_LIMIT':
            errorCode = ERROR_CODES.RATE_LIMIT;
            break;
          case 'REQUEST_DENIED':
            errorCode = ERROR_CODES.FORBIDDEN;
            break;
          case 'UNKNOWN_ERROR':
          default:
            errorCode = ERROR_CODES.SERVER_ERROR;
            break;
        }

        throw new ParkSearchError(
          data.error_message || 'Google Places APIエラー: ' + data.status,
          errorCode
        );
      }

      const parks = data.results.map((place: GooglePlace) => this.transformPlaceToPark(place));

      // 検索結果が0件の場合
      if (parks.length === 0) {
        throw new ParkSearchError('近くに公園が見つかりませんでした', ERROR_CODES.NO_RESULTS);
      }

      return {
        parks,
        total: data.results.length,
        nextPageToken: data.next_page_token,
      };
    } catch (error) {
      console.error('位置情報検索エラー:', error);

      // すでにParkSearchErrorならそのまま投げる
      if (error instanceof ParkSearchError) {
        throw error;
      }

      // ネットワークエラーの処理
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ParkSearchError('ネットワークエラーが発生しました', ERROR_CODES.NETWORK_ERROR);
      }

      // その他のエラー
      throw new ParkSearchError(
        error instanceof Error ? error.message : '位置情報検索に失敗しました',
        ERROR_CODES.UNKNOWN_ERROR
      );
    }
  }

  /**
   * Google Places APIのレスポンスをPark型に変換
   * @param place Google Places APIのレスポンス
   * @returns Park型
   */
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

/**
 * 公園検索サービスのインスタンス
 */
export const parkSearchService = new ParkSearchService();
