import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia" as any,

});

const createPaymentIntent = async (amount: number, currency: string = "usd") => {
    return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency,
        payment_method_types: ["card"],
        
    });
};

export const stripeService = {
    createPaymentIntent,
};