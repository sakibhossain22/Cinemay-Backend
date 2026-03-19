import { Request, Response } from "express";
import { authServices } from "./auth.services";
import { tokenUtils } from "../../src/utils/token";

const register = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        // Here you would typically call your authentication service to register the user
        const result = await authServices.register(req.body);
        if (result.accessToken) {
            // Set the access token in a cookie
            tokenUtils.setBetterAuthAccessTokenCookie(res, result.token as string);
        }
        if (result.accessToken) {
            tokenUtils.setAccessTokenCookie(res, result.accessToken as string);
        }
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            ok: true,
            result
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Register User"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const login = async (req: Request, res: Response) => {
    try {
        const result = await authServices.login(req.body);
        if (result.accessToken) {
            tokenUtils.setBetterAuthAccessTokenCookie(res, result.token as string);
        }
        if (result.accessToken) {
            tokenUtils.setAccessTokenCookie(res, result.accessToken as string);
        }
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            ok: true,
            result
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Login User"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await authServices.sendResetCode(email);
        res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;
        await authServices.verifyCodeAndResetPassword(email, code, newPassword);
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const authController = {
    register,
    login,
    forgotPassword,
    resetPassword
}