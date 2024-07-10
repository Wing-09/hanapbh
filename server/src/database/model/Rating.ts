import { Model, model, Schema } from "mongoose";

const ratingSchema = new Schema({
  value: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Rating = model("Rating", ratingSchema);

export type Rating = typeof Rating extends Model<infer D, any, any> ? D : never;
export default Rating;
