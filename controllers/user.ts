import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AdminUser from "../models/user";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email });

  //   if (!user) {
  //     res.status(404).json({
  //       message: "User donot exist",
  //     });
  //     return;
  //   }

  //   if (!user.isActiveAdmin) {
  //     res.status(500).json({
  //       message: "No longer approved, talk to senior position",
  //     });
  //   }

  //   const verifyPassword = bcrypt.compare(password, user.password);

  //   if (!verifyPassword) {
  //     res.status(401).json({
  //       message: "Invalid email or password",
  //     });
  //   }

  const payload = { email, role: "admin" };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "12h",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged in successfully" });
  return;
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Immediately expire the cookie
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

