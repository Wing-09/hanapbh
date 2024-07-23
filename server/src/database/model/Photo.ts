import { model, Schema, Types } from "mongoose";

export type PhotoType = {
  url: string;
  type?: "PROFILE" | "LODGING" | "ROOM";
  width: number;
  height: number;
  user?: Types.ObjectId;
  lodging?: Types.ObjectId;
  room?: Types.ObjectId;
  date_created?: Date;
  last_updated: Date;
};

const photoSchema = new Schema<PhotoType>({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["PROFILE", "LODGING", "ROOM"],
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  room: { type: Schema.Types.ObjectId, ref: "Room" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, required: true },
});

photoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Photo = model("Photo", photoSchema);

export default Photo;
