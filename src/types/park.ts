export interface Park {
  name: string;
  vicinity: string;
  place_id: string;
  location: {
    lat: number;
    lng: number;
  };
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
}
