export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  birthday?: Date;
  gender: {
    type: "MALE" | "FEMALE" | "OTHER" | "";
    other: string;
  };
  lodgings?: Lodging[];

  rated?: Rating[];

  contact?: {
    phone_number: string = "";
    facebook: string = "";
    instagram: string = "";
    twitter_x: string = "";
  };
  photo: Photo;
  favorites?: Favorite[];
  date_created?: Date;
  last_updated?: Date;
};

export type Photo = {
  url: string;
  type: "PROFILE_PIC" | "LODGING_PIC" | "ROOM_PIC";
  width: number;
  height: number;
  user?: User;
  lodging?: Lodging;
  room?: Room;
  date_created?: Date;
  last_updated?: Date;
};
