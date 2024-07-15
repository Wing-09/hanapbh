import { Model, model, Schema, ValidatorProps } from "mongoose";

const userSchema = new Schema(
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
    lodgings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lodging",
      },
    ],

    rated: [{ type: Schema.Types.ObjectId, ref: "Rating" }],

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
    photo: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Favorite",
      },
    ],
    date_created: {
      type: Date,
      default: Date.now,
    },
    last_updated: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const User = model("User", userSchema);

export type UserType = typeof User extends Model<infer D, any, any> ? D : never;
export default User;
