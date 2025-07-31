import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import AdminUser from "../models/user";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User donot exist",
    });
    return;
  }

  if (!user.isActiveAdmin) {
    res.status(500).json({
      message: "No longer approved, talk to senior position",
    });
  }

  const verifyPassword = bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }

  if (!user) {
    res.status(200).json({
      message: "User cannot found",
    });
    return;
  }

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

export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.userEmail;
    const { newEmail } = req.body;

    if (!newEmail) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }

    const existingUser = await AdminUser.findOne({ email: newEmail });
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Email updated successfully",
      email: updatedUser.email,
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email });

  if (user) {
    res.status(403).json({
      message: "Email already in use.",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await AdminUser.create({
    email: email,
    password: hashedPassword,
  });

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
    .json({ message: "Registered successfully", id: newUser._id });
  return;
};
