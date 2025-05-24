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
  },
  { timestamps: true }
);

let AdminUser;

if (adminConnection) {
  const AdminUser: Model<IAdminUser> =
    adminConnection.models.AdminUser ||
    adminConnection.model<IAdminUser>("AdminUser", AdminUserSchema);
}

export default AdminUser;
