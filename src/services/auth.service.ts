import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { emailService } from "./email.service";

export const authService = {
    async sendVerificationToken(email: string) {
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        });

        const token = randomUUID();
        const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        await prisma.verificationToken.create({
            data: { identifier: email, token, expires }
        });

        await emailService.sendVerificationEmail(email, token);
    },

    async verifyEmail(token: string) {
        const existingToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!existingToken) {
            return { error: "Invalid token" };
        }

        const hasExpired = new Date() > existingToken.expires;

        if (hasExpired) {
            return { error: "Token has expired" };
        }

        const user = await prisma.user.findUnique({
            where: { email: existingToken.identifier }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
        });

        await prisma.verificationToken.delete({
            where: { token }
        });

        return { success: true, user: updatedUser };
    }
};