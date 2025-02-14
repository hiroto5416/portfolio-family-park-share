'use client';

// import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {  Clock, ListIcon, MapPin } from 'lucide-react';
// import Image from 'next/image';
import React from 'react';

interface PardDetailProps {
  name: string;
  address: string;
  hours: string;
  facilities: string[];
  images: string[];
}

export const ParkDetail: React.FC<PardDetailProps> = ({ address, hours, facilities }) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">住所</p>
            <p className="text-base">{address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-1 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">営業時間</p>
            <p className="text-base">{hours}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ListIcon className="h-5 w-5 mt-1 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">設備</p>
            <ul className="list-disc list-inside mt-1">
              {facilities.map((facility, index) => (
                <li key={index} className="text-base">
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
