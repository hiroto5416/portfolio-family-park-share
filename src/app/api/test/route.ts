// src/app/api/test/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // プロフィールの作成テスト
    const profile = await prisma.profile.create({
      data: {
        username: 'testuser',
        avatarUrl: null,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
