import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import express, { Application, NextFunction, Request, Response } from "express";
import { errorhandler } from "./middlewares/errorHandler";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import auth from "./routes/auth";
import post from "./routes/post";
import user from "./routes/user";
import comment from "./routes/comment";
import message from "./routes/messages";
import conversation from "./routes/conversation";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api", auth);
app.use("/api", post);
app.use("/api", user);
app.use("/api", comment);
app.use("/api", message);
app.use("/api", conversation);

// fs.readdirSync("./src/routes").map((r) =>
//   app.use("/api", require(`./routes/${r}`))
// );

//
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  throw new Error(`The url ${req.originalUrl} doesnt exist`);
  next();
});

app.use(errorhandler);

export default app;
