import { Role } from "../../generated/prisma/enums";
import checkAuth from "../lib/middlewares/checkAuth";
import { purchaseController } from "./purchase.controller";
import { Router } from "express";

const router = Router();

router.get("/", checkAuth(Role.USER), purchaseController.getMyMovies)
// router.post("/", checkAuth(Role.USER), purchaseController.purchaseMovie)
router.post("/create-payment-intent", checkAuth(Role.USER), purchaseController.startPurchase);
router.post("/confirm", checkAuth(Role.USER), purchaseController.confirmPurchase);





export const purchaseRoutes = router;