import { model, Schema, Types } from "mongoose";

export type LodgingType = {
  owner?: Types.ObjectId;
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
  photos: Types.ObjectId[];
  favored_by: Types.ObjectId[];
  rated_by: Types.ObjectId[];
  rooms: Types.ObjectId[];
  date_created: Date;
  last_updated: Date;
};

const lodgingSchema = new Schema<LodgingType>(
  {
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
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
    favored_by: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
    rated_by: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
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
lodgingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Lodging = model("Lodging", lodgingSchema);

export default Lodging;
