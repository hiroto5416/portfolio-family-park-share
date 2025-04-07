// src/app/api/test/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // プロフィールの作成テスト
    const users = await prisma.user.create({
      data: {
        name: 'testuser',
        avatarUrl: null,
        email: 'testuser@example.com',
        password: 'password',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
