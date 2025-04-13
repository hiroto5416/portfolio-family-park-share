import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

/**
 * サインアップ
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // バリデーション
    if (!name || !email || !password) {
      return NextResponse.json({ error: '必須項目が入力されていません' }, { status: 400 });
    }

    // パスワードチェック
    if (password.length < 8 || password.length > 32) {
      return NextResponse.json(
        { error: 'パスワードは８文字以上３２文字以下で入力してください' },
        { status: 400 }
      );
    }

    // 数字を含むかチェック
    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'パスワードには最低１つの数字を含めてください' },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signup error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
  }
}
