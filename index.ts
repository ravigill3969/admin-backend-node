import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/user";
import ConnectDB from "./utils/mongoose";
import cookieParser from "cookie-parser";

dotenv.config({});

ConnectDB();

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "34kb" }));

app.use("/admin/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log("object", process.env.PORT);
});
