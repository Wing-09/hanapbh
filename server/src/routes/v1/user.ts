import { hash } from "bcrypt";
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

      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
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
  });
//read route

//update route
//delete route

const user_v1_router = router;

export default user_v1_router;
