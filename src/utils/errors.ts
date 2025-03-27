export class ParkSearchError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ParkSearchError';
  }
}

// エラーメッセージの定義
export const ERROR_MESSAGES = {
  API_ERROR: 'APIの呼び出しに失敗しました',
  INVALID_QUERY: '検索キーワードを入力してください',
  NO_RESULTS: '検索結果が見つかりませんでした',
  LOCATION_ERROR: '位置情報の取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
} as const;
