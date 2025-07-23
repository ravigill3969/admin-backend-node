import express from "express";
import {
  inActiveProducts,
  makeProductActiveWithId,
} from "../controllers/product";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.get("/get-inAct-product",verifyToken, inActiveProducts);
router.patch("/make-it-active/:id",verifyToken, makeProductActiveWithId);

const productRouter = router;
export default productRouter;
