import express from "express";
import {
  inActiveProducts,
  makeProductActiveWithId,
} from "../controllers/product";

const router = express.Router();

router.get("/get-inAct-product", inActiveProducts);
router.patch("/make-it-active/:id", makeProductActiveWithId);

const productRouter = router;
export default productRouter;
