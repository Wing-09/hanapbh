import { Document, Model, model, Schema, Types, ValidatorProps } from "mongoose";
import { L } from "./Lodging";
import { F } from "./Favorite";
import { P, PhotoType } from "./Photo";
import { RA } from "./Rating";

export interface U {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string | null;
  birthday?: Date;
  gender?: {
    type: "MALE" | "FEMALE" | "OTHER";
    other: string;
  };
  photo_id?: Types.ObjectId;
  lodging_ids?: Types.ObjectId[];
  rated_ids?: Types.ObjectId[];
  favored_ids?: Types.ObjectId[];
  contact?: {
    phone_number: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  date_created?: Date;
  last_updated: Date;
}

export interface UserType extends U {
  id: string;
  photo: PhotoType;
}

const userSchema = new Schema<U>(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,

      validate: {
        validator: (v: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      // required: true,
    },
    gender: {
      type: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
      },
      other: { type: String },
    },

    contact: {
      phone_number: { type: String, default: "" },
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      twitter_x: {
        type: String,
        default: "",
      },
    },
    lodging_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lodging",
      },
    ],
    rated_ids: [{ type: Schema.Types.ObjectId, ref: "Rating" }],

    photo_id: {
      type: Schema.Types.ObjectId,
      ref: "Favorite",
      required: true,
    },
    favored_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Favorite",
      },
    ],
    date_created: {
      type: Date,
      default: Date.now,
    },
    last_updated: { type: Date, required: true },
  },
  { versionKey: false }
);

const User = model("User", userSchema);

export default User;
