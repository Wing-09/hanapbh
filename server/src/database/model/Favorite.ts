import { Document } from "mongoose";
import { Model, model, Schema } from "mongoose";
import { U } from "./User";
import { L } from "./Lodging";

export interface F extends Document {
  user_id: U["_id"];
  lodging_id: L["_id"];
  date_created: Date;
}

export interface FavoriteType extends Omit<F, keyof Document> {
  id: string;
}

const favoriteSchema = new Schema<F>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lodging_id: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = model("Favorite", favoriteSchema);

export default Favorite;
