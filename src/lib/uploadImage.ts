import { supabase } from './supabase';

/**
 * レビュー画像をアップロードする
 * @param files アップロードするファイル
 * @param reviewId レビューID
 * @returns アップロードされた画像のURL
 */
export async function uploadReviewImages(files: File[], reviewId: string): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${reviewId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${reviewId}/${fileName}`;

    const { error } = await supabase.storage.from('review-images').upload(filePath, file);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('review-images').getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
}
