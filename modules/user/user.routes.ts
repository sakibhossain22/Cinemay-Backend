import { Router } from "express";
import { userController } from "./user.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/subscribe",checkAuth(Role.USER), userController.subscribeUser);
router.post("/confirm-subscription",checkAuth(Role.USER), userController.confirmUserSubscription);




export const userRoutes = router;