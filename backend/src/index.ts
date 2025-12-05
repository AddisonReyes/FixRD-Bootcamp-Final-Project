import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { ApiResponse } from "@bootcamp/core";
import errors from "./middlewares/errors.js";

import technicianRoutes from "./routes/technicians.js";
import requestRoutes from "./routes/requests.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const env: string = process.env.NODE_ENV || "dev";
let port: string = process.env.PORT || "3000";
const app = express();

const connectionString: string | undefined =
  env === "prod" ? process.env.MONGO_URL_PROD : process.env.MONGO_URL_DEV;

// Settings
if (connectionString) {
  mongoose.connect(connectionString);
  console.log(" + Database conected.");
} else {
  console.log(" - The server does not have a connection link to the database.");
}

// Config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: env === "dev" ? ["http://localhost:3000", "http://localhost:3001"] : process.env.URL,
    credentials: true
  })
);

// Setup routes and middlewares
app.use("/api", technicianRoutes);
app.use("/api", requestRoutes);
app.use("/api", reviewRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response) => {
  const response: ApiResponse<string> = { success: true, data: "Hello World!" };
  res.status(200).json(response);
});

app.use(errors);

// Listen port
app.listen(port, () => {
  if (env === "dev") {
    console.log(`Server running in http://localhost:${port}.`);
  } else {
    console.log(`Server running.`);
  }
});
