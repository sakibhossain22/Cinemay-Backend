import { UserRole } from "../lib/middlewares/auth";
import { prisma } from "../lib/prisma";

async function seedAdminUser() {
    try {
        const adminData = {
            name: "Shakib Admin",
            email: "admin@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234",
            phone: "01996818622",
            status: "ACTIVE"
        }
        const admingExists = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (admingExists) {
            throw new Error('This Email Already Registered ... !!')
        }
        const backendUrl = process.env.BETTER_AUTH_URL
        const signUpAdmin = await fetch(`${backendUrl}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }
    } catch (error) {
        console.error(error);
    }

}
seedAdminUser()