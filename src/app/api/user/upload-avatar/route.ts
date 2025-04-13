import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * アバターのアップロードAPI
 * @param request リクエスト
 * @returns アバターのアップロード結果
 */
export async function POST(request: NextRequest) {
  try {
    // 環境変数のチェック
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      });
      return NextResponse.json({ error: 'サーバー設定が正しくありません' }, { status: 500 });
    }

    // セッション情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('No session found');
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // リクエストボディを取得
    const body = await request.json();
    const { userId, fileBase64, fileName, contentType } = body;

    if (!userId || !fileBase64 || !fileName) {
      console.error('Missing required data:', {
        hasUserId: !!userId,
        hasFileBase64: !!fileBase64,
        hasFileName: !!fileName,
      });
      return NextResponse.json({ error: '必要なデータが不足しています' }, { status: 400 });
    }

    // Base64データをバイナリに変換
    const fileData = Buffer.from(fileBase64.split(',')[1], 'base64');

    // ファイル名の生成
    const fileExt = fileName.split('.').pop();
    const filePath = `${userId}.${fileExt}`;

    // Service Roleキーを使用してSupabaseクライアントを初期化
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ファイルをアップロード
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileData, {
        upsert: true,
        contentType: contentType || 'image/svg+xml',
      });

    if (uploadError) {
      console.error('Upload error details:', {
        error: uploadError,
        message: uploadError.message,
        name: uploadError.name,
      });
      return NextResponse.json(
        { error: '画像のアップロードに失敗しました', details: uploadError },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Prismaを使用してユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        avatarUrl: publicUrl,
      },
    });

    if (!updatedUser) {
      console.error('Failed to update user profile');
      return NextResponse.json({ error: 'プロフィール更新に失敗しました' }, { status: 500 });
    }

    // 成功レスポンスを返す
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Avatar upload error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました', details: String(error) },
      { status: 500 }
    );
  }
}
