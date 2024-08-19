import { model, Schema, Types } from "mongoose";

export type OccupantType = {
  room: Types.ObjectId;
  user: Types.ObjectId;
  status: "OCCUPYING" | "LEFT";
  joined: Date;
  left: Date | "PRESENT";
};

const occupantSchema = new Schema<OccupantType>({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["OCCUPYING", "LEFT"],
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  left: {
    type: Date || String,
    enum: ["PRESENT"],
    default: "PRESENT",
  },
});

occupantSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Occupant = model("Occupant", occupantSchema);

export default Occupant;
