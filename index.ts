import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/user";
import ConnectDB from "./utils/mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

ConnectDB();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "POST"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "34kb" }));

app.use("/admin/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log("object", process.env.PORT);
});
