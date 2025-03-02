import React, { useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

interface Park {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

export const GoogleMapComponent = () => {
  const [parks, setParks] = useState<Park[]>([])
  return (
    <GoogleMap>
      {parks.map((park, index) => (
        <MarkerF key={index} position={park.location} title={park.name} />
      ))}
    </GoogleMap>
  );
};
