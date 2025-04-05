// app/api/user/upload-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('API route called with POST method');

    // セッション情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // リクエストボディを取得
    const body = await request.json();
    const { userId, fileBase64, fileName, contentType } = body;

    console.log('Request data received:', {
      userId,
      fileName,
      contentType: contentType?.substring(0, 30),
    });

    if (!userId || !fileBase64 || !fileName) {
      return NextResponse.json({ error: '必要なデータが不足しています' }, { status: 400 });
    }

    // Base64データをバイナリに変換
    const fileData = Buffer.from(fileBase64.split(',')[1], 'base64');

    // ファイル名の生成
    const fileExt = fileName.split('.').pop();
    const filePath = `${userId}.${fileExt}`;

    console.log('Uploading file to Supabase:', { filePath });

    // Service Roleキーを使用してSupabaseクライアントを初期化
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ファイルをアップロード
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileData, {
        upsert: true,
        contentType: contentType || 'image/svg+xml',
      });

    console.log(uploadError?.message);

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      return NextResponse.json(
        { error: '画像のアップロードに失敗しました', details: uploadError },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    console.log('Upload successful, got URL:', publicUrl);

    // Prismaを使用してユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        avatarUrl: publicUrl, // avatar_url ではなく avatarUrl を使用
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'プロフィール更新に失敗しました' }, { status: 500 });
    }

    console.log('User profile updated successfully with avatar_url');

    // 成功レスポンスを返す
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('アバター更新エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `アバターの更新に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
