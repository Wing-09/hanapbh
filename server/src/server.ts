import express from "express";
import cors from "cors";
import JSONResponse from "./lib/json-response";
import mongoDBConnection from "./database/connection";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

// server configuration
const app = express();

//mongodb connection
mongoDBConnection();

//middleware
app.use(express.json());
app.use(cors());

//routes
// app.use("/v1", v1_router);
app.get("/ready", (_, response) => {
  return response.status(200).json(JSONResponse("OK", "server running"));
});

//server listen
app.listen(8000, () =>
  console.log(`server running in ${process.env.NODE_ENV} mode ...`)
);
