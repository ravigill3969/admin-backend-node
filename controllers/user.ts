import { NextFunction, Request, Response } from "express";
import AdminUser from "../models/user";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(req.body);
};
