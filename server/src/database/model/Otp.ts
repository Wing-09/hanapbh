import { Model, model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
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
  },
  { versionKey: false }
);

const Otp = model("OTP", otpSchema);

export type OTPType = typeof Otp extends Model<infer D, any, any> ? D : never;
export default Otp;
