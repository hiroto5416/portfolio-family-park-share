import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // バリデーション
    if (!username || !email || !password) {
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

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'ユーザー登録に失敗しました' }, { status: 500 });
  }
}
