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


        const authCookie = req.cookies["better-auth.session_token"];
        console.log("Auth Cookie: ", authCookie);
        if (!authCookie) {
            return res.status(401).json({ error: "Unauthorized: No token found" });
        }
        const token = authCookie.split(".")[0];

        console.log("authcookie", authCookie)
        // const sessions = await auth.api.getSession({
        //     headers: new Headers(req.headers as any),

        // })
        const session = await prisma.session.findFirst({
            where: {
                token: token,
            },
            include: {
                user: true
            }
        });
        console.log("session ", session)

        if (!session || !session.user) {
            console.log("session ", session)

            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified,
            status: session.user.status as string,
            isPremium: session.user.isPremium 
        };

        // রোল চেক করা
        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role as Role))) {
            return res.status(403).json({ error: "Forbidden: You don't have permission" });
        }

        next();
    };
};
export default checkAuth;