import { z } from "zod";

export const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is too short"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    zip: z.string().min(3, "ZIP code is required"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;