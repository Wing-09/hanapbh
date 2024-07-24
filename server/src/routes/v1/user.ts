import Photo, { PhotoType } from "../../database/model/Photo";
import User, { UserType } from "../../database/model/User";
import exclude from "../../lib/exclude";
import JSONResponse from "../../lib/json-response";
import { compare, hash } from "bcrypt";
import { Router } from "express";
import { startSession } from "mongoose";

const router = Router();

router
  //create route
  .post("/", async (request, response) => {
    try {
      const session = await startSession();
      const user: UserType & { photo: PhotoType } = request.body;

      const found_email = await User.findOne({ email: user.email });

      if (found_email)
        return response
          .status(409)
          .json(JSONResponse("CONFLICT", "email already used"));

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
        url: user.photo.url,
        height: user.photo.height,
        width: user.photo.width,
        last_updated: new Date(),
        type: "PROFILE",
        user: new_user._id!,
      });

      await new_photo.save({ session });

      new_user.photo = new_photo._id;

      await new_user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return response
        .status(201)
        .json(
          JSONResponse(
            "CREATED",
            " new user created",
            exclude(new_user.toJSON(), ["password"])
          )
        );
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  })
  .post("/authenticate", async (request, response) => {
    try {
      const { email, password }: Record<string, string> = request.body;

      const found_user = await User.findOne({
        email: {
          $regex: "^" + email.toLowerCase(),
        },
      }).populate("photo");

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user does not exist"));

      if (!found_user.password)
        return response
          .status(403)
          .json(
            JSONResponse(
              "FORBIDDEN",
              "you can only login in with the account using google authentication"
            )
          );

      if (!(await compare(password, found_user.password!)))
        return response
          .status(401)
          .json(JSONResponse("UNAUTHORIZED", "incorrect password"));

      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            "user authenticated",
            exclude(found_user.toJSON(), ["password"])
          )
        );
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  })
  //read route
  .get("/:id", async (request, response) => {
    try {
      const user_id = request.params.id;

      const found_user = await User.findOne({ _id: user_id })
        .select("-password")
        .populate("photo");

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user does not exist"));

      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            "request successful",
            exclude(found_user.toJSON(), ["password"])
          )
        );
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  })
  .get("/email/:email", async (request, response) => {
    try {
      const user_email = request.params.email;

      const found_user = await User.findOne({
        email: user_email.toLowerCase(),
      })
        .select("-password")
        .populate("photo");

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user not found"));

      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            "request successful",
            exclude(found_user.toJSON(), ["password"])
          )
        );
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  })
  //update route
  //delete route
  .delete("/", async (request, response) => {
    try {
      const { id } = request.body;

      if (!id)
        return response
          .status(400)
          .json(
            JSONResponse(
              "BAD_REQUEST",
              "id field is required on the request body"
            )
          );

      const found_user = await User.findOne({ _id: id });

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user not found"));

      await User.deleteOne({ _id: id });

      return response.status(200).json(JSONResponse("OK", "user deleted"));
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  });
const user_v1_router = router;

export default user_v1_router;
