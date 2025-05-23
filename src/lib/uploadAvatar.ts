import { getSession } from 'next-auth/react';

/**
 * アバターをアップロードする
 * @param file アップロードするファイル
 * @param userId ユーザーID
 * @returns アバターのURL
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // セッションを取得
    const session = await getSession();
    if (!session) {
      throw new Error('認証が必要です');
    }

    // ファイルをBase64に変換
    const fileBase64 = await convertFileToBase64(file);

    // APIエンドポイントにPOSTリクエストを送信
    const response = await fetch('/api/user/upload-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fileBase64,
        fileName: file.name,
        contentType: file.type,
      }),
    });

    // レスポンスを処理
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('レスポンス解析エラー:', error);
      throw new Error(
        `APIレスポンスの解析に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    if (!response.ok) {
      console.error('アップロードエラー詳細:', data);
      throw new Error(
        `アップロードエラー: ${data?.error || response.statusText || 'unknown error'}`
      );
    }

    return data.url;
  } catch (error) {
    console.error('アバターアップロードエラー:', error);
    throw error;
  }
}

// ファイルをBase64に変換するヘルパー関数
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
