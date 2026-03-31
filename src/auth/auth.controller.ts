import { Request, response, Response } from "express";
import { authServices } from "./auth.services";
import { tokenUtils } from "../utils/token";
import { cookieFunc } from "../utils/cookie";

const register = async (req: Request, res: Response) => {
    try {
        const result = await authServices.register(req.body);
        if (result.accessToken) {
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
const googleLogin = async (req: Request, res: Response) => {
    try {
        // ১. সার্ভিস থেকে সোশ্যাল লগইন প্রসেস করা
        // নোট: এখানে req.body তে 'provider': 'google' থাকতে পারে
        const result = await authServices.googleLogin();

        // ২. টোকেন চেক এবং কুকি সেট করা
        // Better Auth এর অরিজিনাল টোকেন কুকি সেট করা
        // if (result?.token) {
        //     tokenUtils.setBetterAuthAccessTokenCookie(res, result.token as string);
        // }

        // // আপনার কাস্টম জেনারেটেড এক্সেস টোকেন কুকি সেট করা
        // if (result?.accessToken) {
        //     tokenUtils.setAccessTokenCookie(res, result.accessToken as string);
        // }

        // ৩. সাকসেস রেসপন্স
        res.status(200).json({
            success: true,
            message: "User logged in with Google successfully",
            ok: true,
            result
        });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Login with Google";
        res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
};
const logout = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies["better-auth.session_token"];
        const accessToken = req.cookies["accessToken"];

        if (sessionToken) {
            await authServices.logOut(sessionToken);
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            maxAge: 0,
            path: "/"
        };

        res.clearCookie("better-auth.session_token", cookieOptions);

        if (accessToken) {
            res.clearCookie("accessToken", cookieOptions);
        }

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
            ok: true
        });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Logout User";
        res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
}
export const authController = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    googleLogin
}