import { model, Schema, Types } from "mongoose";

export type PropertyType = {
  owner?: Types.ObjectId;
  name: string;
  type?: "BOARDING_HOUSE" | "BED_SPACER" | "APARTMENT" | "PAD";
  description: string;
  amenities: (
    | "FREE_WATER"
    | "FREE_WIFI"
    | "FREE_ELECTRICITY"
    | "LAUNDRY_AREA"
    | "KITCHEN_AREA"
    | "AIR_CONDITION"
    | "PRIVATE_BATHROOM"
    | "COMMON_BATHROOM"
    | "TELEVISION"
    | "LOCKERS"
    | "CCTV"
    | "PARKING_LOT"
  )[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  distance: number;
  address: {
    vicinity: string;
    street: string;
    province: string;
    municipality_city: string;
    barangay: string;
  };
  provider: string;
  photos: Types.ObjectId[];
  reviews: Types.ObjectId[];
  rooms: Types.ObjectId[];
  date_created: Date;
  last_updated: Date;
};

const propertySchema = new Schema<PropertyType>(
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
      enum: ["BOARDING_HOUSE", "BED_SPACER", "APARTMENT", "PAD", ""],
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    amenities: [
      {
        type: String,
        enum: ["WATER", "WIFI", "COMFORT_ROOM", "LAUNDRY_AREA", "KITCHEN_AREA"],
        default: [],
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
      vicinity: {
        type: String,
        required: true,
      },
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
    provider: {
      type: String,
      default: "DB",
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room", default: [] }],
    photos: [{ type: Schema.Types.ObjectId, ref: "Photo", default: [] }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],
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

propertySchema.index({ location: "2dsphere" });
propertySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Property = model("Property", propertySchema);

export default Property;
