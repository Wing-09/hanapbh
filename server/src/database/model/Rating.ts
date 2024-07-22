import { Document } from "mongoose";
import { Model, model, Schema } from "mongoose";
import { U } from "./User";
import { L } from "./Lodging";

export interface RA extends Document {
  value: number;
  user_id: U["_id"];
  lodging_id: L["_id"];
  date_created: Date;
  last_updated: Date;
}

export interface RatingType extends Omit<RA, keyof Document> {
  id: string;
}

const ratingSchema = new Schema<RA>({
  value: { type: Number, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  lodging_id: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Rating = model("Rating", ratingSchema);

export default Rating;
