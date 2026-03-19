import { NextFunction, Request, Response } from "express";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../prisma";

// Express Request Interface এক্সটেন্ড করা
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
                status: string;
                isPremium: boolean;
            };
        }
    }
}

const checkAuth = (...role: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log("access Token", req.cookies["accessToken"])
        // console.log("Session Token", req.cookies["better-auth.session_token"])
        
        const authCookie = req.cookies["better-auth.session_token"];
        if (!authCookie) {
            return res.status(401).json({ error: "Unauthorized: No token found" });
        }
        // const sessions = await auth.api.getSession({
        //     headers: new Headers(req.headers as any),

        // })
        const session = await prisma.session.findFirst({
            where: {
                token: authCookie,
            },
            include: {
                user: true
            }
        });
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // রিকোয়েস্ট অবজেক্টে ইউজার ডাটা সেট করা
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified,
            status: session.user.status as string,
            isPremium: session.user.isPremium // এখন আর এরর দিবে না
        };

        // রোল চেক করা
        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role as Role))) {
            return res.status(403).json({ error: "Forbidden: You don't have permission" });
        }

        next();
    };
};
export default checkAuth;