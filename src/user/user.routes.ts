import { Router } from "express";
import { userController } from "./user.controller";
import checkAuth from "../lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/dashboard", checkAuth(Role.USER), userController.getDashboard);
router.get("/profile", checkAuth(Role.USER, Role.ADMIN), userController.getMyProfile);
router.post("/subscribe", checkAuth(Role.USER), userController.subscribeUser);
router.post("/confirm-subscription", checkAuth(Role.USER), userController.confirmUserSubscription);

router.patch("/profile/update", checkAuth(Role.USER, Role.ADMIN), userController.updateMyProfile);



export const userRoutes = router;