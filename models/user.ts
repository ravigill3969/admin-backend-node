// src/models/adminUser.ts
import { Schema, Model, Document } from "mongoose";
import ConnectDB from "../utils/mongoose";

const { adminConnection } = ConnectDB();

export interface IAdminUser extends Document {
  email: string;
  password: string;
  isActiveAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  isApproved: Boolean;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 3 },
    isActiveAdmin: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (!adminConnection) {
  throw new Error("Admin DB connection is not established yet");
}

const AdminUser: Model<IAdminUser> =
  adminConnection.models.AdminUser ||
  adminConnection.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
