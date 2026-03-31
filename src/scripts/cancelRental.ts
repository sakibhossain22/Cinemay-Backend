import cron from "node-cron";
import { prisma } from "../../src/lib/prisma";


cron.schedule("*/30 * * * *", async () => {
    try {
        console.log("Checking for expired movie rentals...");

        const now = new Date();

        const deletedPurchases = await prisma.purchase.deleteMany({
            where: {
                type: "RENT",
                expiresAt: {
                    lt: now,
                },
            },
        });

        if (deletedPurchases.count > 0) {
            console.log(`Successfully removed ${deletedPurchases.count} expired rentals.`);
        } else {
            console.log("No expired rentals found.");
        }

    } catch (error: any) {
        console.error("Error in expired rentals cron job:", error.message);
    }
});
