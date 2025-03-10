import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  console.log('--------- レビュー投稿API実行開始 ---------');

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // ログインユーザーの取得
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: 'ログインが必要です',
          details: sessionError?.message,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { content, parkId } = await request.json();

    // リクエストデータの取得
    console.log('受信データ:', { content, parkId });

    if (!content || !parkId) {
      return NextResponse.json(
        {
          error: 'レビュー内容と公園IDが必要です',
        },
        { status: 400 }
      );
    }

    // ステップ1: 公園データの確認と作成
    console.log('公園データを確認中...');
    const { data: existingPark, error: parkCheckError } = await supabase
      .from('parks')
      .select('id')
      .eq('place_id', parkId)
      .maybeSingle();

    if (parkCheckError) {
      console.error('公園データ確認エラー:', parkCheckError);
      return NextResponse.json(
        {
          error: '公園データの確認に失敗しました',
          details: parkCheckError.message,
        },
        { status: 500 }
      );
    }

    // 公園のUUID
    let parkUUID;

    if (!existingPark) {
      // 公園が存在しない場合は新規作成
      console.log('公園データが存在しないため作成します');
      parkUUID = randomUUID();

      const { error: createParkError } = await supabase.from('parks').insert({
        id: parkUUID,
        place_id: parkId,
        // 最低限必要なその他のフィールド
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (createParkError) {
        console.error('公園データ作成エラー:', createParkError);
        return NextResponse.json(
          {
            error: '公園データの作成に失敗しました',
            details: createParkError.message,
          },
          { status: 500 }
        );
      }

      console.log('公園データを作成しました:', parkUUID);
    } else {
      // 既存の公園IDを使用
      parkUUID = existingPark.id;
      console.log('既存の公園データを使用します:', parkUUID);
    }

    // レビューの作成
    const reviewId = randomUUID();
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        id: reviewId,
        park_id: parkUUID,
        user_id: userId,
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (reviewError) {
      console.error('レビュー作成エラー:', reviewError);
      return NextResponse.json(
        {
          error: 'レビューの作成に失敗しました',
          details: reviewError.message,
        },
        { status: 500 }
      );
    }

    console.log('レビューの作成に成功しました:', reviewId);
    return NextResponse.json({
      success: true,
      message: 'レビューを投稿しました',
      review: reviewData,
    });
  } catch (error) {
    console.error('全体エラー:', error);
    return NextResponse.json(
      {
        error: 'レビュー投稿処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
