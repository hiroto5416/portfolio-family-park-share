import React from 'react';
import { ParkCard } from './park-card';

const DUMMY_PARKS = [
  {
    id: 1,
    name: '公園1',
    address: '東京都千代田区永田町1-7-1',
    image: '/images/park1.jpg',
    features: ['遊具', 'ベビーカー置き場', 'おやつ置き場'],
    reviewCount: 0,
    location: { lat: 35.6895, lng: 139.6917 }, // Example coordinates
  },
  {
    id: 2,
    name: '公園2',
    address: '東京都千代田区永田町1-7-1',
    image: '/images/park2.jpg',
    features: ['遊具', 'ベビーカー置き場', 'おやつ置き場'],
    reviewCount: 0,
    location: { lat: 35.6895, lng: 139.6917 }, // Example coordinates
  },
  {
    id: 3,
    name: '公園3',
    address: '東京都千代田区永田町1-7-1',
    image: '/images/park3.jpg',
    reviewCount: 0,
    location: { lat: 35.6895, lng: 139.6917 }, // Example coordinates
  },
];

export function ParkList() {
  return (
    <section>
      <h2>近くの公園</h2>
      <div>
        {DUMMY_PARKS.map((park) => (
          <ParkCard key={park.id} {...park} />
        ))}
      </div>
    </section>
  );
}
