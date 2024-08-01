export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password?: string;
  birthday?: Date;
  gender?: {
    type: "MALE" | "FEMALE" | "OTHER" | "";
    other: string;
  };
  lodgings?: Lodging[];

  rated?: Rating[];

  contact?: {
    phone_number: string;
    facebook: string;
    instagram: string;
    twitter_x: string;
  };
  photo?: {
    url: string;
    width: number;
    height: number;
  };
  favorites?: Favorite[];
  date_created?: Date;
  last_updated?: Date;
};

export type Lodging = {
  id: string;
  owner?: string;
  name: string;
  type?: "BOARDING_HOUSE" | "BED_SPACER" | "APARTMENT" | "PAD";
  description: string;
  offers: (
    | "WATER"
    | "WIFI"
    | "COMFORT_ROOM"
    | "LAUNDRY_AREA"
    | "KITCHEN_AREA"
  )[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: {
    vicinity: string;
    street: string;
    province: string;
    municipality_city: string;
    barangay: string;
  };
  distance: number;
  provider: "GOOGLE" | "DB";
  photos: Photo[];
  favored_by: string[];
  rated_by: string[];
  rooms: string[];
  date_created: Date;
  last_updated: Date;
};

export type Photo = {
  id: string;
  url: string;
  type?: "PROFILE" | "LODGING" | "ROOM";
  width: number;
  height: number;
  user?: string;
  lodging?: string;
  room?: string;
  date_created?: Date;
  last_updated: Date;
};
