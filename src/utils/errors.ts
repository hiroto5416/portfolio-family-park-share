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

// エラーコードの定義
export const ERROR_CODES = {
  API_ERROR: 'API_ERROR',
  INVALID_QUERY: 'INVALID_QUERY',
  NO_RESULTS: 'NO_RESULTS',
  LOCATION_ERROR: 'LOCATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  TIMEOUT: 'TIMEOUT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// エラーメッセージの定義
export const ERROR_MESSAGES = {
  [ERROR_CODES.API_ERROR]: 'APIの呼び出しに失敗しました',
  [ERROR_CODES.INVALID_QUERY]: '検索キーワードを入力してください',
  [ERROR_CODES.NO_RESULTS]: '検索結果が見つかりませんでした',
  [ERROR_CODES.LOCATION_ERROR]: '位置情報の取得に失敗しました',
  [ERROR_CODES.NETWORK_ERROR]: 'ネットワークエラーが発生しました',
  [ERROR_CODES.AUTH_ERROR]: '認証に失敗しました',
  [ERROR_CODES.SERVER_ERROR]: 'サーバーエラーが発生しました',
  [ERROR_CODES.UNAUTHORIZED]: 'この操作を行う権限がありません',
  [ERROR_CODES.FORBIDDEN]: 'アクセスが拒否されました',
  [ERROR_CODES.NOT_FOUND]: 'リソースが見つかりませんでした',
  [ERROR_CODES.RATE_LIMIT]: 'リクエスト制限に達しました。しばらく待ってから再試行してください',
  [ERROR_CODES.TIMEOUT]: 'リクエストがタイムアウトしました',
  [ERROR_CODES.VALIDATION_ERROR]: '入力データが無効です',
  [ERROR_CODES.UNKNOWN_ERROR]: '不明なエラーが発生しました',
} as const;

// HTTPステータスコードとエラーコードのマッピング
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, keyof typeof ERROR_CODES> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  429: 'RATE_LIMIT',
  500: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  504: 'TIMEOUT',
};

// エラーコードからメッセージを取得する関数
export function getErrorMessage(code: keyof typeof ERROR_CODES): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR;
}

// エラーをユーザーフレンドリーに処理する関数
export function handleError(error: unknown): { code: keyof typeof ERROR_CODES; message: string } {
  if (error instanceof ParkSearchError && error.code) {
    return {
      code: error.code as keyof typeof ERROR_CODES,
      message: ERROR_MESSAGES[error.code as keyof typeof ERROR_CODES] || error.message,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
  };
}
