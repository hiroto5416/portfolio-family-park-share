import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body = await request.json();
    
    // 公園データを保存
    const park = await prisma.park.upsert({
      where: { place_id: body.place_id },
      update: {
        name: body.name,
        address: body.address,
      },
      create: {
        place_id: body.place_id,
        name: body.name,
        address: body.address,
      },
    });

    return NextResponse.json({ success: true, park });
  } catch (error) {
    console.error('公園データの保存エラー:', error);
    return NextResponse.json(
      { error: '公園データの保存に失敗しました' },
      { status: 500 }
    );
  }
}