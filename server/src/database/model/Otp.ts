import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,

    default: Date.now,
  },
});

const OTP = model("OTP", otpSchema);

export type OTP = typeof OTP extends Model<infer D, any, any> ? D : never;
export default OTP;
