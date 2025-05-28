import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express request to include user as string (user ID)
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const userId = decoded.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.user = userId;

    return res.status(200).json({ message: "Token verified", user: userId });
    // Or use `next()` if it's middleware
    // next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
