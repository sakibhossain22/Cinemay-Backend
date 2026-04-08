import { Router } from "express";
import { authController } from "./auth.controller";
import checkAuth from "../lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/google-login", authController.googleLogin)

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", checkAuth(Role.ADMIN, Role.USER), authController.logout);


export const authRoutes = router;