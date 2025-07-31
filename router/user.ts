import express from "express";
import { login, register, updateEmail } from "../controllers/user";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/update-email", verifyToken, updateEmail);

const userRouter = router;
export default userRouter;
