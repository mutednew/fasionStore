import {z} from "zod";

export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1),
    role: z.enum(["ADMIN", "CUSTOMER"]).default("CUSTOMER"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Usertype = z.infer<typeof UserSchema>;