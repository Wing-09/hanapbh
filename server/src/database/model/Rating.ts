import { Types } from "mongoose";
import { Document } from "mongoose";
import { model, Schema } from "mongoose";

export type RatingType = {
  value: number;
  user: Types.ObjectId;
  lodging: Types.ObjectId;
  date_created: Date;
  last_updated: Date;
};

const ratingSchema = new Schema<RatingType>({
  value: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

ratingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Rating = model("Rating", ratingSchema);

export default Rating;
