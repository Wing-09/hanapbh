import { compare, hash } from "bcrypt";
import { Router } from "express";
import exclude from "../../lib/exclude";
import JSONResponse from "../../lib/json-response";
import User, { UserType } from "../../database/model/User";

const router = Router();

router
  //create route
  .post("/", async (request, response) => {
    try {
      const user: UserType = request.body;

      const found_email = await User.findOne({ email: user.email });

      if (found_email)
        return response
          .status(409)
          .json(JSONResponse("CONFLICT", "email already used"));

      let password = "";

      if (user.password) {
        password = await hash(user.password, 14);
      }

      const new_user = new User({
        ...user,
        password: password ? password : null,
      });

      await new_user.save();
      const new_user_json = new_user.toJSON();

      return response
        .status(201)
        .json(
          JSONResponse(
            "CREATED",
            " new user created",
            exclude({ id: new_user_json._id, ...new_user_json }, [
              "password",
              "_id",
            ])
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
  .post("/authentication", async (request, response) => {
    try {
      const { email, password }: Record<string, string> = request.body;

      const found_user = await User.findOne({
        email: {
          $regex: "^" + email.toLowerCase(),
        },
      });

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

      const found_user_json = found_user.toJSON();
      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            "user authenticated",
            exclude({ ...found_user_json, id: found_user_json._id }, [
              "password",
              "_id",
            ])
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

      const found_user = await User.findOne({ _id: user_id }).select(
        "-password"
      );

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user does not exist"));

      const found_user_json = found_user.toJSON();
      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            "request successful",
            exclude({ id: found_user_json._id, ...found_user_json }, ["_id"])
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
      }).select("-password");

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "user not found"));

      const found_user_json = found_user.toJSON();
      return response.status(200).json(
        JSONResponse(
          "OK",
          "request successful",
          exclude(
            {
              ...found_user_json,
              id: found_user_json._id,
            },
            ["_id"]
          )
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
