import { Document, model, Schema } from "mongoose";
import { U } from "./User";
import { P, PhotoType } from "./Photo";
import { R, RoomType } from "./Room";
import { F, FavoriteType } from "./Favorite";
import { RA, RatingType } from "./Rating";

export interface L extends Document {
  owner_id?: U["_id"];
  id: string;
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
    street: string;
    province: string;
    municipality_city: string;
    barangay: string;
  };
  photo_id: P["_id"];
  favored_by_ids: F["_id"];
  rated_by_ids: RA["_id"];
  room_ids: R["_id"];
  date_created: Date;
  last_updated: Date;
}

export interface LodgingType extends Omit<L, keyof Document> {
  id: string;
  photos: PhotoType[];
}

const lodgingSchema = new Schema<L>(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["BOARDING_HOUSE", "BED_SPACER", "APARTMENT", "PAD", null],
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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number, Number],
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
    room_ids: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    photo_id: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
    favored_by_ids: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
    rated_by_ids: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    date_created: {
      type: Date,
      default: Date.now,
    },
    last_updated: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

lodgingSchema.index({ location: "2dsphere" });

const Lodging = model("Lodging", lodgingSchema);

export default Lodging;
