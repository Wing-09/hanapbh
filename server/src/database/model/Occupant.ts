import { Types } from "mongoose";

export type OccupantType = {
  room: Types.ObjectId;
  user: Types.ObjectId;
  status: "occupying" | "left";
  joined: Date;
  left: Date;
};
