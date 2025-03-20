// migration-update-reviews.ts
import * as dotenv from 'dotenv';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// プロジェクトルートの.env.localを読み込む
// dotenv.config({ path: join(__dirname, '../../.env.local') });
dotenv.config({ path: join(__dirname, '../../.env') });

// 環境変数を確認するデバッグコード
console.log('環境変数の読み込み状況:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み (値の長さ: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : '未設定');

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URLとSUPABASE_SERVICE_ROLE_KEYを確認してください。'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateReviewsData() {
  console.log('レビューデータマイグレーションを開始します...');

  // 1. 全てのprofilesデータを取得
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, user_id');

  if (profilesError) {
    console.error('プロファイルデータの取得に失敗しました:', profilesError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('プロファイルデータが見つかりませんでした。');
    return;
  }

  console.log(`${profiles.length}件のプロファイルを見つけました`);

  // profilesごとのマッピングを作成 (profile.id => auth.user.id)
  const idMap = new Map();
  profiles.forEach((profile) => {
    idMap.set(profile.id, profile.user_id);
  });

  // 2. レビューを取得
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, user_id');

  if (reviewsError) {
    console.error('レビューデータの取得に失敗しました:', reviewsError);
    return;
  }

  if (!reviews || reviews.length === 0) {
    console.log('レビューデータが見つかりませんでした。');
    return;
  }

  console.log(`${reviews.length}件のレビューを見つけました`);

  // 3. レビューごとにユーザーIDを更新
  let successCount = 0;
  let errorCount = 0;

  for (const review of reviews) {
    const authUserId = idMap.get(review.user_id);

    if (!authUserId) {
      console.warn(`ID ${review.user_id} に対応するauth user idが見つかりませんでした`);
      errorCount++;
      continue;
    }

    // レビューを更新
    const { error } = await supabase
      .from('reviews')
      .update({ user_id: authUserId })
      .eq('id', review.id);

    if (error) {
      console.error(`レビューID ${review.id} の更新に失敗しました:`, error);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`マイグレーション完了: ${successCount}件成功, ${errorCount}件失敗`);
}

// スクリプト実行
migrateReviewsData().catch((err) =>
  console.error('マイグレーション中にエラーが発生しました:', err)
);
