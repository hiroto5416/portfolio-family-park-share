export interface Park {
  // place_id: string;
  // name: string;
  // vicinity: string;
  // location: {
  //   lat: number;
  //   lng: number;
  // };
  // photos?: {
  //   photo_reference: string;
  //   height: number;
  //   width: number;
  // }[];
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
}
