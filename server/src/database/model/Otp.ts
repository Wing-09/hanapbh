import { Model, model, Schema } from "mongoose";

export type OTPType = {
  email: string;
  type: "CREATE_USER" | "CHANGE_PASSWORD";
  pin: string;
  date_created: Date;
};

const otpSchema = new Schema<OTPType>(
  {
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CREATE_USER", "CHANGE_PASSWORD"],
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

export default Otp;
