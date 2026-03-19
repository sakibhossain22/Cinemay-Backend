import { Request, Response } from "express";
import { stripeService } from "../../src/lib/stripe.service";
import { prisma } from "../../src/lib/prisma";
import { userService } from "./user.services";

const subscribeUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { subscriptionType } = req.body;
        console.log(subscriptionType)

        const price = subscriptionType === "MONTHLY" ? 199 : 1999;
        const user = await prisma.user.findUnique(
            {
                where: {
                    id: userId
                }
            }
        );
        if (!user) return res.status(404).json({ message: "User not found" });


        // 1. Create Stripe Payment Intent
        const paymentIntent = await stripeService.createPaymentIntent(price);

        if (!paymentIntent) return res.status(500).json({ message: "Failed to create payment intent" });

        const newPayment = await prisma.payment.create({
            data: {
                userId: userId!,
                amount: price,
                currency: "USD",
                transactionId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret!,
                method: "STRIPE_USER_SUBSCRIPTION",
            }
        });
        res.status(200).json({
            success: true,
            ok: true,
            message: "Payment Intent created successfully",
            ...newPayment
        });
    } catch (error: any) {
        res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
};

const confirmUserSubscription = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const updateUser = await prisma.user.update({
            where: {
                id: userId!
            },
            data: {
                isPremium: true
            }
        });

        res.status(201).json({
            success: true,
            ok: true,
            message: "Subscription confirmed and access granted",
            data: updateUser
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const data = await userService.getUserDashboardData(userId!);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name, image } = req.body;

        const updatedUser = await userService.updateProfile(userId!, { name, image });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const userController = {
    confirmUserSubscription,
    subscribeUser,
    getDashboard,
    updateMyProfile
}