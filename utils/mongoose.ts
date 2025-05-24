// src/utils/mongoose.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({});

let cached = {
  adminConnection: null as null | mongoose.Connection,
  sellerConnection: null as null | mongoose.Connection,
};

export default function ConnectDB() {
  if (cached.adminConnection && cached.sellerConnection) {
    // console.log(cached);
    return cached;
  }

  const sellerConnection = mongoose.createConnection(
    process.env.MONGO_DB_URI_SELLER!
  );
  const adminConnection = mongoose.createConnection(
    process.env.MONGO_DB_URI_ADMIN!
  );

  sellerConnection.on("connected", () => console.log("✅ Seller DB connected"));
  adminConnection.on("connected", () => console.log("✅ Admin DB connected"));

  sellerConnection.on("error", (err) =>
    console.error("❌ Seller DB error", err)
  );
  adminConnection.on("error", (err) => console.error("❌ Admin DB error", err));

  process.on("SIGINT", async () => {
    await sellerConnection.close();
    await adminConnection.close();
    console.log("🛑 MongoDB connections closed due to app termination");
    process.exit(0);
  });

  cached.adminConnection = adminConnection;
  cached.sellerConnection = sellerConnection;

  return cached;
}
