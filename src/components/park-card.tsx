import React from 'react';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';

/**
 * 公園カードのプロップス
 */
interface ParkCardProps {
  name: string;
  address: string;
  image?: string;
  features?: string[];
  reviewCount: number;
  location: {
    lat: number;
    lng: number;
  };
  photoReference?: string;
}

/**
 * 公園カード
 * @param name 公園名
 * @param address 公園住所
 * @returns 公園カード
 */
export const ParkCard = ({ name, address }: ParkCardProps) => {
  return (
    <Card>
      <div>
        <Image src="/placeholder.jpg" alt={name} width={300} height={200} />
      </div>
      <CardContent>
        <h3>{name}</h3>
        <p>{address}</p>
      </CardContent>
    </Card>
  );
};
