import { Document, Model, model, Schema } from "mongoose";
import { LodgingType } from "./Lodging";
import { Types } from "mongoose";

export type RoomType = {
  lodging: Types.ObjectId;
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
  photos: Types.ObjectId[];
  date_created: Date;
  last_updated: Date;
};

const roomSchema = new Schema<RoomType>({
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
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
  photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
  date_created: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

roomSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Room = model("Room", roomSchema);

export default Room;
