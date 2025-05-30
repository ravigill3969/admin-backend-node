import { NextFunction, Request, Response } from "express";
import ConnectDB from "../utils/mongoose";
import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongodb";

export const inActiveProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerConnection } = await ConnectDB();

    if (!sellerConnection) {
      res.status(500).json({ message: "Database connection failed" });
      return;
    }

    const productsCollection = sellerConnection.collection("products");

    const inactiveProducts = await productsCollection
      .find({ isActive: false })
      .toArray();

    res.status(200).json({
      message: "Inactive products fetched successfully",
      count: inactiveProducts.length,
      products: inactiveProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      status: false,
    });
  }
};

export const makeProductActiveWithId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const { sellerConnection } = await ConnectDB();

    if (!sellerConnection) {
      res.status(500).json({
        message: "Database connection failed",
        status: false,
      });
      return;
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const product = await sellerConnection
      .collection("products")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isActive: true } },
        { returnDocument: "after" }
      );

    if (!product) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    res.status(200).json({
      message: "success",
      status: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
    return;
  }
};
