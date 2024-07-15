import { Router } from "express";
import JSONResponse from "../../lib/json-response";
import "dotenv/config";
import { createTransport } from "nodemailer";
import OTP from "../../database/model/Otp";
import { render } from "@react-email/components";
import OTPEmail from "../../lib/email/OTPEmail";

const router = Router();
const gmail_password = process.env.GMAIL_2F_AUTH_APP_PASS;
if (!gmail_password)
  throw new Error("GMAIL_2F_AUTH_APP_PASS is missing from your .env file");

router
  // create router
  .post("/", async (request, response) => {
    try {
      const { email } = request.body;

      if (!email)
        return response
          .status(400)
          .json(
            JSONResponse(
              "BAD_REQUEST",
              "email field is required on the request body"
            )
          );

      const transport = createTransport({
        service: "gmail",
        auth: {
          user: "hanapbh.dev@gmail.com",
          pass: gmail_password,
        },
      });

      const verify = await transport.verify();

      if (!verify)
        response
          .status(500)
          .json(
            JSONResponse(
              "INTERNAL_SERVER_ERROR",
              "email transport verify failed"
            )
          );

      const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
      let random_string = "";

      for (let i = 0; i < 6; i++) {
        random_string += chars[Math.floor(Math.random() * chars.length)];
      }

      const otp = new OTP({
        email: email,
        pin: random_string.toUpperCase(),
      });
      otp.save();

      const at_index = email.indexOf("@");
      const user_name = email.substring(0, at_index);

      const html = render(OTPEmail({ user_name, code: random_string }));

      transport.sendMail(
        {
          from: "hanapbh.dev@gmail.com",
          to: email,
          subject:
            "welcome to Hanap BH your verification code is " +
            random_string.toLocaleUpperCase(),
          html,
        },
        (error) => {
          if (error)
            return response
              .status(500)
              .json(JSONResponse("INTERNAL_SERVER_ERROR"));
        }
      );

      return response
        .status(201)
        .json(JSONResponse("CREATED", "OTP verification code is sent"));
    } catch (error) {
      console.error(error);
      return response.status(500).json(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  })
  .post("/authenticate", async (request, response) => {
    try {
      const { otp, email } = request.body;
      if (!otp || !email)
        return response
          .status(400)
          .json(
            JSONResponse(
              "BAD_REQUEST",
              "otp and email field is required on the request body"
            )
          );

      const found_otp = await OTP.findOne({ email, pin: otp });

      if (!found_otp)
        return response
          .status(401)
          .json(JSONResponse("UNAUTHORIZED", "otp is incorrect"));

      await OTP.deleteMany({ email });
      return response.status(200).json(JSONResponse("OK", "otp verified"));
    } catch (error) {
      console.error(error);
      return response.status(500).json(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });

// read router

// update router
// delete router

const otp_v1_router = router;

export default otp_v1_router;
