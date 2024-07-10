import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { Router } from "express";
import exclude from "../../lib/exclude";
import JSONResponse from "../../lib/json-response";
import { prisma } from "../../server";

const router = Router();

router
  //create route
  .post("/", async (request, response) => {
    try {
      const user: User = request.body;

      const found_email = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (found_email)
        return response
          .status(409)
          .json(JSONResponse("CONFLICT", "email already used"));

      let password = "";
      if (user.password) {
        password = await hash(user.password, 14);
      }

      const new_user = await prisma.user.create({
        data: { ...user, password },
        include: {
          photo: true,
        },
      });

      return response
        .status(200)
        .json(
          JSONResponse(
            "OK",
            " new user created",
            exclude(new_user, ["password"])
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

  //update route
  .patch("/:id/password", async (request, response) => {
    try {
      const { password } = request.body;
      const user_id = request.params.id;

      if (!password)
        return response
          .status(400)
          .json(
            JSONResponse(
              "BAD_REQUEST",
              "password is missing from the request body"
            )
          );

      const found_user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      if (!found_user)
        return response
          .status(404)
          .json(JSONResponse("NOT_FOUND", "use does not exist"));

      const updated_user = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          password: await hash(password, 14),
        },
      });

      return response
        .status(200)
        .json(JSONResponse("OK", "user password updated"));
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json(
          JSONResponse("INTERNAL_SERVER_ERROR", "oops! something went wrong")
        );
    }
  });
//delete route

const user_v1_router = router;

export default user_v1_router;
