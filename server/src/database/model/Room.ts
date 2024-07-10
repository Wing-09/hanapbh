import { Model, model, Schema } from "mongoose";

const roomSchema = new Schema({
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

const Room = model("Room", roomSchema);

export type Room = typeof Room extends Model<infer D, any, any> ? D : never;

export default Room;
