import { model, Schema } from "mongoose";
import { Types } from "mongoose";

export type FavoriteType = {
  user: Types.ObjectId;
  lodging: Types.ObjectId;
  date_created: Date;
};

const favoriteSchema = new Schema<FavoriteType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lodging: { type: Schema.Types.ObjectId, ref: "Lodging" },
  date_created: {
    type: Date,
    default: Date.now,
  },
}, {versionKey: false});

favoriteSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Favorite = model("Favorite", favoriteSchema);

export default Favorite;
