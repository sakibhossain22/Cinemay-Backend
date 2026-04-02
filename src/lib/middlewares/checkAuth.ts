import { NextFunction, Request, Response } from "express";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../prisma";

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
                sessionToken: string;
            };
        }
    }
}

const checkAuth = (...role: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {


        const authCookie = req.cookies["better-auth.session_token"];
        if (!authCookie) {
            return res.status(401).json({ error: "Unauthorized: No token found" });
        }
        const token = authCookie.split(".")[0];

        const session = await prisma.session.findFirst({
            where: {
                token: token,
            },
            include: {
                user: true
            }
        });

        if (!session || !session.user) {

            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified,
            status: session.user.status as string,
            isPremium: session.user.isPremium,
            sessionToken: session.token
        };

        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role as Role))) {
            return res.status(403).json({ error: "Forbidden: You don't have permission" });
        }

        next();
    };
};
export default checkAuth;