import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/user";
import ConnectDB from "./utils/mongoose";
dotenv.config({});

const { adminConnection, sellerConnection } = ConnectDB();

const app = express();

app.use("/admin/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log("object", process.env.PORT);
});
