import { Document, Model, model, Schema } from "mongoose";
import { L } from "./Lodging";
import { P, PhotoType } from "./Photo";

export interface R extends Document {
  lodging_id: L["_id"];
  description: string;
  bed_count: number;
  occupant_count: number;
  price?: {
    type:
      | "PER_HOUR"
      | "PER_SIX_HOUR"
      | "PER_TWELVE_HOUR"
      | "PER_NIGHT"
      | "PER_MONTH";
    amount: number;
  };
  photo_ids: P["_id"][];
  date_created: Date;
  last_updated: Date;
}

export interface RoomType extends Omit<R, keyof Document> {
  id: string;
  photos: PhotoType[];
}

const roomSchema = new Schema<R>({
  lodging_id: { type: Schema.Types.ObjectId, ref: "Lodging" },
  description: { type: String, default: "" },
  bed_count: { type: Number, default: null },
  price: {
    type: {
      type: String,
      enum: [
        "PER_HOUR",
        "PER_SIX_HOUR",
        "PER_TWELVE_HOUR",
        "PER_NIGHT",
        "PER_MONTH",
      ],
      default: "",
    },
    amount: {
      type: Number,
      default: null,
    },
  },
  occupant_count: {
    type: Number,
    default: null,
  },
  photo_ids: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
  date_created: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

const Room = model("Room", roomSchema);

export default Room;
