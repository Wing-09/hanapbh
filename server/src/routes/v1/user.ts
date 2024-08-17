import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Photo, { PhotoType } from "../../database/model/Photo";
import User, { UserType } from "../../database/model/User";
import exclude from "../../lib/exclude";
import { compare, hash } from "bcrypt";
import JSONResponse from "../../lib/json-response";
import { startSession } from "mongoose";
import Property from "../../database/model/Property";
import Room from "../../database/model/Room";
import Otp from "src/database/model/Otp";

export default function userV1Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  //create route
  fastify.post<{ Body: UserType & { photo: PhotoType } }>(
    "/",
    async (request, reply) => {
      try {
        const session = await startSession();
        session.startTransaction();

        const user = request.body;

        const found_email = await User.findOne({ email: user.email });

        if (found_email)
          return reply
            .code(409)
            .send(JSONResponse("CONFLICT", "email already used"));

        let password = "";

        if (user.password) {
          password = await hash(user.password, 14);
        }

        const new_user = new User<UserType>({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          password: password ? password : null,
          birthday: user.birthday ? user.birthday : undefined,
          gender: user.gender
            ? { type: user.gender.type, other: user.gender.other }
            : undefined,
          last_updated: new Date(),
        });

        await new_user.save({ session });

        const new_photo = new Photo<PhotoType>({
          user: new_user._id!,
          url: user.photo.url,
          height: user.photo.height,
          width: user.photo.width,
          last_updated: new Date(),
          type: "PROFILE",
        });

        await new_photo.save({ session });
        new_user.photo = new_photo._id;
        await new_user.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return reply
          .code(201)
          .send(
            JSONResponse(
              "CREATED",
              "new user created",
              exclude(new_user.toJSON(), ["password"])
            )
          );
      } catch (error) {
        fastify.log.error(error);
        return reply
          .code(500)
          .send(
            JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
          );
      }
    }
  );
  fastify.post<{ Body: Record<string, string> }>(
    "/authenticate",
    async (request, reply) => {
      try {
        const { email, password } = request.body;

        const found_user = await User.findOne({
          email: {
            $regex: "^" + email.toLowerCase(),
          },
        }).populate("photo");

        if (!found_user)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "user does not exist"));

        if (!found_user.password)
          return reply
            .code(403)
            .send(
              JSONResponse(
                "FORBIDDEN",
                "you can only login in with the account using google authentication"
              )
            );

        if (!(await compare(password, found_user.password!)))
          return reply
            .code(401)
            .send(JSONResponse("UNAUTHORIZED", "incorrect password"));

        return reply
          .code(200)
          .send(
            JSONResponse(
              "OK",
              "user authenticated",
              exclude(found_user.toJSON(), ["password"])
            )
          );
      } catch (error) {
        fastify.log.error(error);
        return reply
          .code(500)
          .send(
            JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
          );
      }
    }
  );
  //read route
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const user_id = request.params.id;

      const found_user = await User.findOne({ _id: user_id })
        .select("-password")
        .populate("photo");

      if (!found_user)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "user does not exist"));

      return reply
        .code(200)
        .send(
          JSONResponse(
            "OK",
            "request successful",
            exclude(found_user.toJSON(), ["password"])
          )
        );
    } catch (error) {
      fastify.log.error(error);
      return reply
        .code(500)
        .send(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  });
  fastify.get<{ Params: { email: string } }>(
    "/email/:email",
    async (request, reply) => {
      try {
        const user_email = request.params.email;

        const found_user = await User.findOne({
          email: user_email.toLowerCase(),
        })
          .select("-password")
          .populate("photo");

        if (!found_user)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "user not found"));

        return reply
          .code(200)
          .send(
            JSONResponse(
              "OK",
              "request successful",
              exclude(found_user.toJSON(), ["password"])
            )
          );
      } catch (error) {
        fastify.log.error(error);
        return reply
          .code(500)
          .send(
            JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
          );
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id/lodging/occupancy-rate",
    async (request, reply) => {
      try {
        const { id } = request.params;

        const found_user = await User.exists({ _id: id });

        if (!found_user)
          return reply
            .code(400)
            .send(JSONResponse("NOT_FOUND", "user does not exist"));

        const occupant = await User.aggregate([
          {
            $match: { _id: id },
          },
          {
            $lookup: {
              from: "properties",
              as: "properties",
              localField: "properties",
              foreignField: "_id",
            },
          },
          {
            $unwind: "$properties",
          },
          {
            $unwind: "$properties.rooms",
          },
          {
            $lookup: {
              from: "rooms",
              localField: "properties.rooms",
              as: "rooms",
              foreignField: "_id",
            },
          },
          {
            $unwind: "$rooms",
          },
          {
            $group: {
              max_occupant: { $sum: "$rooms.max_occupant" },
              occupants: { $sum: { $size: "rooms.occupants" } },
            },
          },
          {
            $project: {
              max_occupant: { $ifnull: ["$max_occupant", 0] },
              occupants: { $ifnull: ["$occupants", 0] },
              occupancy_rate: {
                $cond: {
                  if: { $eq: ["max_occupant", 0] },
                  then: 0,
                  else: {
                    $multiply: [
                      { divide: ["occupants", "max_occupants"] },
                      100,
                    ],
                  },
                },
              },
            },
          },
        ]);

        return reply.code(200).send(
          JSONResponse(
            "OK",
            "request successful",
            occupant.length > 0
              ? occupant[0]
              : {
                  max_occupant: 0,
                  occupants: 0,
                  occupancy_rate: 0,
                }
          )
        );
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );
  fastify.get<{ Params: { id: string } }>(
    "/:id/revenue/estimate",
    async (request, reply) => {
      try {
        const { id } = request.params;

        const found_user = User.exists({ _id: id });

        if (!found_user)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "user does not exist"));

        const properties = await Property.find({ owner: id });

        let revenue = 0;
        if (properties.length < 1)
          return reply.code(404).send(
            JSONResponse("NOT_FOUND", "user does not have any property", {
              revenue,
            })
          );

        for (const property of properties) {
          const rooms = await Room.find({ property: property._id });

          for (const room of rooms) {
            let room_revenue = 0;
            switch (room.price.per_time) {
              case "PER_HOUR": {
                room_revenue += room.price.amount * 24 * 30;
                break;
              }
              case "PER_SIX_HOUR": {
                room_revenue += room.price.amount * 4 * 30;
                break;
              }
              case "PER_TWELVE_HOUR": {
                room_revenue += room.price.amount * 2 * 30;
                break;
              }
              case "PER_NIGHT": {
                room_revenue += room.price.amount * 30;
                break;
              }
              case "PER_MONTH": {
                room_revenue += room.price.amount;
                break;
              }
              default:
                break;
            }

            if (room.price.type === "PER_PERSON") {
              revenue += room_revenue * room.occupants.occupying.length;
            }
          }
        }
        return reply.code(200).send(
          JSONResponse("OK", "request successful", {
            estimate_revenue: revenue,
          })
        );
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );
  //update route
  fastify.get<{
    Params: { key: keyof UserType };
    Body: Omit<UserType, "photo"> & {
      pin: string;
      id: string;
      photo: PhotoType;
    };
  }>("/key", async (request, reply) => {
    try {
      const { key } = request.params;
      const {
        id,
        email,
        first_name,
        middle_name,
        last_name,
        password,
        photo,
        birthday,
        contact,
        gender,
        pin,
      } = request.body;

      if (!id)
        return reply
          .code(400)
          .send(
            JSONResponse("BAD_REQUEST", "id is required on the request body")
          );

      const found_user = await User.findOne({ _id: id });

      if (!found_user)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "user not found"));

      switch (key) {
        case "email": {
          if (!email)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "email is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { email, last_updated: new Date() } }
          );
          break;
        }
        case "first_name": {
          if (!first_name)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "first_name is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { first_name, last_updated: new Date() } }
          );
          break;
        }
        case "middle_name": {
          if (!middle_name)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "middle_name is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { middle_name, last_updated: new Date() } }
          );
          break;
        }
        case "last_name": {
          if (!last_name)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "last_name is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { last_name, last_updated: new Date() } }
          );
          break;
        }
        case "password": {
          if (found_user.password && !password)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "email is required on the request body"
                )
              );

          if (!found_user.password) {
            if (!pin)
              return reply
                .code(400)
                .send(
                  JSONResponse(
                    "BAD_REQUEST",
                    "otp is required when the user does not have a password"
                  )
                );
            const found_otp = await Otp.findOne({
              email,
              type: "CHANGE_PASSWORD",
              pin,
            });
            if (!found_otp)
              return reply
                .code(401)
                .send(JSONResponse("UNAUTHORIZED", "pin is incorrect"));
          } else {
            if (!(await compare(found_user.password!, password!)))
              return reply
                .code(401)
                .send(JSONResponse("UNAUTHORIZED", "incorrect password"));
          }
          await User.updateOne(
            { _id: id },
            {
              $set: {
                password: await hash(password!, 14),
                last_updated: new Date(),
              },
            }
          );
          break;
        }
        case "birthday": {
          if (!birthday)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "birthday is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { birthday, last_updated: new Date() } }
          );
          break;
        }
        case "contact": {
          if (!email)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "contact is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { contact, last_updated: new Date() } }
          );
          break;
        }
        case "gender": {
          if (!email)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "gender is required on the request body"
                )
              );

          await User.updateOne(
            { _id: id },
            { $set: { gender, last_updated: new Date() } }
          );
          break;
        }
        case "photo": {
          if (!photo)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "photo is required on the request body"
                )
              );

          const new_photo = new Photo(photo);
          await User.updateOne(
            { _id: id },
            { $set: { photo: new_photo, last_updated: new Date() } }
          );
          await Photo.deleteOne({ _id: found_user.photo });
          break;
        }
        default:
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "only keys of model User is valid as a request parameter"
              )
            );
      }

      const new_user = User.findOne({ _id: id })
        .select("-password")
        .populate("photos");

      return reply
        .code(200)
        .send(JSONResponse("OK", "user " + key + "has been updated", new_user));
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
  //delete route
  fastify.delete<{ Body: { id: string } }>("/", async (request, reply) => {
    try {
      const { id } = request.body;

      if (!id)
        return reply
          .code(400)
          .send(
            JSONResponse(
              "BAD_REQUEST",
              "id field is required on the request body"
            )
          );

      const found_user = await User.findOne({ _id: id });

      if (!found_user)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "user not found"));

      await User.deleteOne({ _id: id });

      return reply.code(200).send(JSONResponse("OK", "user deleted"));
    } catch (error) {
      fastify.log.error(error);
      return reply
        .code(500)
        .send(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  });
  done();
}
