import { Request, Response } from "express";
import { authServices } from "./auth.services";

const register = async (req: Request, res: Response) => {
    try {
        // Here you would typically call your authentication service to register the user
        const result = await authServices.register(req.body);
        res.status(200).json({
            success: true,
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
        // Here you would typically call your authentication service to login the user
        const result = await authServices.login(req.body);
        res.status(200).json({
            success: true,
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


export const authController = {
    register,
    login
}