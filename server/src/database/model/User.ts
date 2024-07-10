import { Model, model, Schema, ValidatorProps } from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
    required: false,
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
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  lodgings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lodging",
    },
  ],

  rated: [{ type: Schema.Types.ObjectId, ref: "Rating" }],

  contact: {
    phone_number: { type: String, required: true },
    facebook: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: true,
    },
    twitter_x: {
      type: String,
      required: true,
    },
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
    required: true,
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
});

const User = model("User", userSchema);

export type User = typeof User extends Model<infer D, any, any> ? D : never;
export default User;
