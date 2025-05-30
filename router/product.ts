import express from "express";
import {
  inActiveProducts,
  makeProductActiveWithId,
} from "../controllers/product";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.use(verifyToken);

router.get("/get-inAct-product", inActiveProducts);
router.patch("/make-it-active/:id", makeProductActiveWithId);

const productRouter = router;
export default productRouter;
