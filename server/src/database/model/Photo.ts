import { Document, Model, model, Schema } from "mongoose";
import { U } from "./User";
import { L } from "./Lodging";
import { R } from "./Room";

export interface P extends Document {
  url: string;
  type?: "PROFILE" | "LODGING" | "ROOM";
  width: number;
  height: number;
  user_id?: U["_id"];
  lodging_id: L["_id"];
  room_id: R["_id"];
  date_created: Date;
  last_updated: Date;
}
export interface PhotoType extends Omit<P, keyof Document> {
  id: string;
}

const photoSchema = new Schema<P>({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["PROFILE", "LODGING", "ROOM"],
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  lodging_id: { type: Schema.Types.ObjectId, ref: "Lodging" },
  room_id: { type: Schema.Types.ObjectId, ref: "Room" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, required: true },
});

const Photo = model("Photo", photoSchema);

export default Photo;
