import { Model, model, Schema } from "mongoose";

const photoSchema = new Schema({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["PROFILE_PIC", "LODGING_PIC", "ROOM_PIC"],
    default: "",
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  room: { type: Schema.Types.ObjectId, ref: "Room" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Photo = model("Photo", photoSchema);

export type Photo = typeof Photo extends Model<infer D, any, any> ? D : never;
export default Photo;
