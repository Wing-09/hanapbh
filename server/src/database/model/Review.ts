import { Types } from "mongoose";
import { model, Schema } from "mongoose";

export type ReviewType = {
  user: Types.ObjectId;
  lodging: Types.ObjectId;
  rate: number;
  comment: string;
  date_created: Date;
  last_updated: Date;
};

const reviewSchema = new Schema<ReviewType>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
    rate: { type: Number, required: true },
    comment: { type: String, default: "" },
    date_created: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

reviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Review = model("Review", reviewSchema);

export default Review;
