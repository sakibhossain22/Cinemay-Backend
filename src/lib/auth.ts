import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { oAuthProxy } from "better-auth/plugins";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL || "", "http://localhost:5000"],
  baseURL: process.env.BACKEND_URL || "",
  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    cookies: {
      session_token: {
        name: "better-auth.session_token", 
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "better-auth.state_token", 
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", isRequired: true, default: Role.USER },
      status: { type: "string", required: true, default: UserStatus.ACTIVE },
      phone: { type: "string", required: false },
      isPremium: { type: "boolean", required: true, default: false },
      resetCodeExpires: { type: "date", required: false },
      resetCode: { type: "string", required: false },
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github :{
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }
  },
  plugins: [oAuthProxy()],

});
