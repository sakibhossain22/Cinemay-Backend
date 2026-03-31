import { Request, Response } from "express";
import { stripeService } from "../lib/stripe.service";
import { prisma } from "../lib/prisma";
import { userService } from "./user.services";
import { PaymentStatus } from "../../generated/prisma/enums";

const subscribeUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { subscriptionType } = req.body;
        const existingPayment = await prisma.payment.findFirst({
            where: {
                userId: userId!,
                method: "STRIPE_USER_SUBSCRIPTION",
                status: PaymentStatus.PENDING
            }
        })
        if (existingPayment) return res.status(400).json(
            {
                success : false,
                ok : false,
                message: "You have a pending subscription. Please complete the payment.",
                transactionId: existingPayment.transactionId,
                clientSecret : existingPayment.clientSecret
            }
        );
        const userAlreadySubscribed = await prisma.payment.findFirst({
            where: {
                userId: userId!,
                method: "STRIPE_USER_SUBSCRIPTION",
                status: PaymentStatus.SUCCESS
            }
        })

        if (userAlreadySubscribed) return res.status(400).json({
             success: false,
             ok: false,
             message: "You already have an active subscription" 
            });


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
        console.log(paymentIntent);
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
        const { transactionId } = req.body;
        const updateUser = await prisma.user.update({
            where: {
                id: userId!
            },
            data: {
                isPremium: true
            }
        });
        const updatePayment = await prisma.payment.update({
            where: {
                transactionId
            },
            data: {
                status: PaymentStatus.SUCCESS
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
            ok: true,
            message: "Dashboard data retrieved successfully",
            data
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

const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name, image, phone } = req.body;

        const updatedUser = await userService.updateProfile(userId!, { name, image, phone });

        res.status(200).json({
            success: true,
            ok: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await userService.getProfile(userId!);

        res.status(200).json({
            success: true,
            ok: true,
            message: "Profile retrieved successfully",
            data: user
        });
    } catch (error: any) {
        res.status(500).json(
            {
                success: false,
                message: error.message
            })
            
    }
};

export const userController = {
    confirmUserSubscription,
    subscribeUser,
    getDashboard,
    updateMyProfile,
    getMyProfile
};
