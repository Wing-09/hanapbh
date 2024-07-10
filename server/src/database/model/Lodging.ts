import { Model, model, Schema } from "mongoose";

const lodgingSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["BOARDING_HOUSE", "BED_SPACER", "APARTMENT", "PAD"],
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  offers: [
    {
      type: String,
      enum: ["WATER", "WIFI", "COMFORT_ROOM", "LAUNDRY_AREA", "KITCHEN_AREA"],
      default: "",
    },
  ],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinate: {
      type: [Number],
      required: true,
    },
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    municipality_city: {
      type: String,
      default: "",
    },
    barangay: {
      type: String,
      default: "",
    },
  },
  photos: [{ type: Schema.ObjectId, ref: "Photo" }],
  favored: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  date_created: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

lodgingSchema.index({ location: "2dsphere" });

const Lodging = model("Lodging", lodgingSchema);

export type Lodging = typeof Lodging extends Model<infer D, any, any>
  ? D
  : never;

export default Lodging;
