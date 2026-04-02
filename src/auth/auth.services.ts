import e from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import { transporter } from "../lib/email.config";
import { prisma } from "../lib/prisma";
import { tokenUtils } from "../utils/token";
import { ILogin, RegisterRequest } from "./auth.interface";
import bcrypt from "bcryptjs";
import { AppError } from "../error/AppError";
import { hashPassword } from "better-auth/crypto"

const register = async (data: RegisterRequest) => {
    try {
        const { email, password, name, phone } = data;
        const result = await auth.api.signUpEmail({
            body: {
                email,
                name,
                phone,
                role: Role.USER,
                status: UserStatus.ACTIVE,
                isPremium: false,
                password: password
            }
        });

        if (!result.user) {
            throw new Error("Registration failed");
        }

        let accessTokenGenerated = null;
        if (result?.token) {
            accessTokenGenerated = await tokenUtils.getAccessToken({
                token: result.token,
                id: result.user.id,
                email: result.user.email,
                emailVerified: result.user.emailVerified,
                role: (result.user as any).role,
                status: (result.user as any).status,
                isPremium: (result.user as any).isPremium
            });
        }

        return { ...result, accessToken: accessTokenGenerated };
    } catch (error) {
        throw error;
    }
};
const login = async (data: ILogin) => {
    try {
        const { email, password } = data;
        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        });
        let accessTokenGenerated = null;
        if (result?.token) {
            accessTokenGenerated = await tokenUtils.getAccessToken({
                token: result.token,
                id: result.user.id,
                email: result.user.email,
                emailVerified: result.user.emailVerified,
                role: result.user.role,
                status: result.user.status,
                isPremium: result.user.isPremium
            })

        }
        return { ...result, accessToken: accessTokenGenerated };
    } catch (error) {
        throw error;
    }
}
const googleLogin = async () => {
    try {
        const result = await auth.api.signInSocial({
            body: {
                provider: "google",
            }
        });

        let accessTokenGenerated = null;



        return { ...result, accessToken: accessTokenGenerated };
    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
}


const sendResetCode = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 10 * 60000); 

    const data = await prisma.user.update({
        where: { email },
        data: {
            resetCode: otpCode,
            resetCodeExpires: expires,
        },
    });
    const emailRes = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset Code",
        html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Password Reset Code</h2>
        <p>Use the following code to reset your password. It expires in 10 minutes.</p>
        <h1 style="color: #2563eb; letter-spacing: 5px;">${otpCode}</h1>
      </div>
    `,
    });
    return { message: "Code sent to email" };
};

const verifyCodeAndResetPassword = async (email: string, code: number, newPassword: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email,
            resetCode: code,
            resetCodeExpires: { gt: new Date() },
        },
    });

    if (!user) throw new AppError("Invalid or expired code", 400);

    const hashedPassword = await hashPassword(newPassword);

    const result = await prisma.account.updateMany({
        where: {
            userId: user.id,
            providerId: "credential",
        },
        data: {
            password: hashedPassword,

        },
    });
    await prisma.user.update({
        where: { email },
        data: {
            resetCode: null,
            resetCodeExpires: null
        }
    })
    return {
        success: true,
        message: "Password reset successful",
        ok: true,
        data: result
    };
};
const logOut = async (sessionToken: string) => {
    try {
        const res = await auth.api.signOut({
            headers: new Headers({
                Authorization: `Bearer ${sessionToken}`
            })
        });
        return res;
    } catch (error) {
        throw error;
    }
}
export const authServices = {
    register,
    login,
    verifyCodeAndResetPassword,
    sendResetCode,
    googleLogin,
    logOut
}