export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
  }>;
  opening_hours?: {
    isOpen: () => boolean;
    periods: Array<{
      open: string;
      close: string;
    }>;
  };
  types: string[];
}
