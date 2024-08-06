import "dotenv/config";
import { createTransport } from "nodemailer";
import { render } from "@react-email/components";
import JSONResponse from "../../lib/json-response";
import Otp from "../../database/model/Otp";
import OTPEmail from "../../lib/email/OTPEmail";
import { FastifyInstance, FastifyPluginOptions } from "fastify";


export default function otp_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  const gmail_password = process.env.GMAIL_2F_AUTH_APP_PASS;
  if (!gmail_password)
    throw new Error("GMAIL_2F_AUTH_APP_PASS is missing from your .env file");

  fastify.post<{ Body: { email: string } }>("/", async (request, reply) => {
    try {
      const { email } = request.body;

      if (!email)
        return reply
          .code(400)
          .send(
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
        reply
          .code(500)
          .send(
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

      const otp = new Otp({
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
            return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
        }
      );

      return reply
        .code(201)
        .send(JSONResponse("CREATED", "OTP verification code is sent"));
    } catch (error) {
      console.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });

  fastify.post<{ Body: { otp: string; email: string } }>(
    "/authenticate",
    async (request, reply) => {
      try {
        const { otp, email } = request.body;
        if (!otp || !email)
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "otp and email field is required on the request body"
              )
            );

        const found_otp = await Otp.findOne({ email, pin: otp });

        if (!found_otp)
          return reply
            .code(401)
            .send(JSONResponse("UNAUTHORIZED", "otp is incorrect"));

        await Otp.deleteMany({ email });
        return reply.code(200).send(JSONResponse("OK", "otp verified"));
      } catch (error) {
        console.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );

  done();
}
