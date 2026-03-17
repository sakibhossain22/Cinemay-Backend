import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from "../auth"
import { Role } from "../../../generated/prisma/enums";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
                role?: string;
                emailVerified: boolean;
                status?: string;
            };
        }
    }
}

const checkAuth = (...role: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        console.log(session)
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // if (!session.user.emailVerified) {
        //     return res.status(403).json({ error: "Email not verified" });
        // }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified,
            status: session.user.status
        }
        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role as Role))) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next()
    }
}

export default checkAuth;