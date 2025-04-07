import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('公園データ保存API開始');

    // リクエストボディを取得
    const body = await request.json();
    console.log('受信したデータ:', {
      place_id: body.place_id,
      name: body.name,
      address: body.address,
    });

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

    console.log('公園データ保存成功:', {
      id: park.id,
      place_id: park.place_id,
      name: park.name,
    });

    return NextResponse.json({ success: true, park });
  } catch (error) {
    console.error('公園データの保存エラー:', {
      error,
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      prismaError: error instanceof Error && 'code' in error ? error['code'] : undefined,
    });
    return NextResponse.json(
      {
        error: '公園データの保存に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
