import { Router } from "express";
import { userController } from "./user.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/subscribe", checkAuth(Role.USER), userController.subscribeUser);
router.post("/confirm-subscription", checkAuth(Role.USER), userController.confirmUserSubscription);
router.get("/dashboard", checkAuth(), userController.getDashboard);

router.patch("/profile/update", checkAuth(), userController.updateMyProfile);



export const userRoutes = router;