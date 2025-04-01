import { supabase } from './supabase';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // ファイル名の生成
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${userId}.${fileExt}`;

    // アップロード
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`アップロードエラー: ${uploadError.message}`);
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}
