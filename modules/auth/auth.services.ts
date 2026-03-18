import { Role, UserStatus } from "../../generated/prisma/enums";
import { auth } from "../../src/lib/auth";
import { tokenUtils } from "../../src/utils/token";
import { ILogin, RegisterRequest } from "./auth.interface";


const register = async (data: RegisterRequest) => {
    try {
        const { email, password, name, phone } = data;
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                phone,
                role: Role.USER,
                status: UserStatus.ACTIVE,
                isPremium: false
            }
        });
        let accessTokenGenerated = null;
        if (result?.token) {
            accessTokenGenerated = await tokenUtils.getAccessToken({
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


export const authServices = {
    register,
    login
}