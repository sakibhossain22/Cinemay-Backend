import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: { type: "string", isRequired: true, default: Role.USER },
            status: { type: "string", required: true, default: UserStatus.ACTIVE },
            phone: { type: "string", required: true },
            isPremium: { type: "boolean", required: true, default: false },
        }
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    }
});
