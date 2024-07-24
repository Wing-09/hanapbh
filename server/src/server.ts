import express from "express";
import cors from "cors";
import JSONResponse from "./lib/json-response";
import mongoDBConnection from "./database/connection";
import v1_router from "./routes/v1/v1";

// server configuration
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/v1", v1_router);
app.get("/ready", (_, response) => {
  return response.status(200).json(JSONResponse("OK", "server running"));
});

//ensuring to connect on the database before listening
mongoDBConnection()
  .then(() =>
    app.listen(8000, () =>
      console.log(`server running in ${process.env.NODE_ENV} mode ...`)
    )
  )
  .catch((error) => {
    throw error;
  });
