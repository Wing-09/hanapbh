import { Model, model, Schema } from "mongoose";

const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = model("Favorite", favoriteSchema);

export type Favorite = typeof Favorite extends Model<infer D, any, any>
  ? D
  : never;
export default Favorite;
