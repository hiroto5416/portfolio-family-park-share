'use client';

import { Card } from '@/components/ui/card';
import { Clock, MapPin, Store } from 'lucide-react';
import React from 'react';

/**
 * 公園詳細のプロップス
 */
interface PardDetailProps {
  name: string;
  address: string;
  hours: string | string[] | undefined;
  facilities: string[];
  images: string[];
  businessStatus: string;
}

/**
 * 公園詳細
 * @param name 公園名
 * @param address 住所
 * @param hours 営業時間
 * @param facilities 施設
 * @param images 画像
 */
export const ParkDetail: React.FC<PardDetailProps> = ({
  address,
  businessStatus,
  hours,
}: PardDetailProps) => {
  // 住所から国名と郵便番号を除去する関数
  const formatAddress = (address: string) => {
    // 「日本、〒000-0000 」のパターンを削除
    return address.replace(/^日本、〒\d{3}-\d{4}\s*/, '');
  };

  // 営業時間を整形する関数
  const formatHours = (hours: string | string[] | undefined) => {
    // hoursが未定義の場合は'24時間'を返す
    if (!hours) return '24時間';

    // 文字列の場合
    if (typeof hours === 'string') {
      if (hours === '24時間') return hours;

      try {
        // 文字列を行に分割
        const lines = hours.split(/(?=月曜|火曜|水曜|木曜|金曜|土曜|日曜)/);
        return formatLines(lines);
      } catch (error) {
        console.error('営業時間のフォーマットエラー:', error);
        return '営業時間情報なし';
      }
    }

    // 配列の場合
    if (Array.isArray(hours)) {
      try {
        return formatLines(hours);
      } catch (error) {
        console.error('営業時間の配列フォーマットエラー:', error);
        return '営業時間情報なし';
      }
    }

    return '24時間';
  };

  // 営業時間の行をフォーマットするヘルパー関数
  const formatLines = (lines: string[]) => {
    return lines
      .map((line) => {
        // 曜日と時間の間に空白を追加
        return line.replace(/(.+日):/, '$1: ');
      })
      .join('\n');
  };

  // 営業状況の日本語表示
  const getBusinessStatus = (status: string) => {

    const statusMap: { [key: string]: string } = {
      OPERATIONAL: '営業中',
      OPERATING: '営業中',
      CLOSED_TEMPORARILY: '一時閉鎖中',
      CLOSED_PERMANENTLY: '閉鎖',
      CLOSED: '閉店',
    };

    // statusが存在しない場合は'不明'を返す
    if (!status) {
      return '不明';
    }

    // statusMapに該当する値があればその値を、なければ'不明'を返す
    const mappedStatus = statusMap[status];

    return mappedStatus || '不明';
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">住所</p>
            <p className="text-base">{formatAddress(address)}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Store className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">営業状況</p>
            <p className="text-base">{getBusinessStatus(businessStatus)}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">営業時間</p>
            <pre className="text-base font-sans whitespace-pre-line">{formatHours(hours)}</pre>
          </div>
        </div>
      </div>
    </Card>
  );
};
