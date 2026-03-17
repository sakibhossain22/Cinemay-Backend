import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { Response } from "express";
import { cookieFunc} from "./cookie";

const getAccessToken = async (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
    return accessToken

}


const setAccessTokenCookie = (res: Response, token: string) => {
    cookieFunc.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        // 1 day
        maxAge: 60 * 60 * 24 * 1000
    })
}

const setBetterAuthAccessTokenCookie = (res: Response, token: string) => {
    cookieFunc.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1000,
        path: "/"
    })
}
export const tokenUtils = {
    getAccessToken,
    setAccessTokenCookie,
    setBetterAuthAccessTokenCookie
}