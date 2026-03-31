import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register)
router.post("/login", authController.login)

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
// router.post("/google-login", authController.googleLogin);
// router.post("/google/success", authController.googleSuccess);


export const authRoutes = router;