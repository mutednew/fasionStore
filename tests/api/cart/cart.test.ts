import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "http://localhost:3000";
const userId = "e262dd1c-62bd-4673-92f0-71ad803f0f4a";
const productId = "72d74724-734a-4e9a-a497-6241ddb3cca2";

let createdItemId: string | null = null;

describe("CART API", () => {
    it("should return the cart for the user", async () => {
        const response = await request(baseUrl)
            .get("/api/cart")
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("items");
        expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it("should return 404 if cart not found", async () => {
        const response = await request(baseUrl)
            .get("/api/cart")
            .set("x-user-id", "non-existing-user-id")
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Cart not found");
    });

    it("should add an item to the cart", async () => {
        const response = await request(baseUrl)
            .post(`/api/cart/${userId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .send({
                productId,
                quantity: 2,
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("items");

        const items = response.body.data.items;
        expect(Array.isArray(items)).toBe(true);

        if (items.length > 0) {
            createdItemId = items[items.length - 1].id;
        }

        expect(createdItemId).toBeDefined();
    });

    it("should return 400 if invalid cart item data provided", async () => {
        const response = await request(baseUrl)
            .post(`/api/cart/${userId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .send({
                productId,
                quantity: -2,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid cart item");
    });

    it("should return the cart by userId", async () => {
        const response = await request(baseUrl)
            .get(`/api/cart/${userId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("items");
    });

    it("should return the number of items in the cart", async () => {
        const response = await request(baseUrl)
            .get(`/api/cart/${userId}/count`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("count");
        expect(typeof response.body.data.count).toBe("number");
    });

    it("should update the quantity of an item in the cart", async () => {
        expect(createdItemId).toBeTruthy();

        const response = await request(baseUrl)
            .put(`/api/cart/${userId}/item/${createdItemId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .send({ quantity: 5 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const newQuantity = response.body.data.items[0].quantity;
        expect(newQuantity).toBe(5);
    });

    it("should return 400 if invalid quantity provided", async () => {
        const response = await request(baseUrl)
            .put(`/api/cart/${userId}/item/${createdItemId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .send({ quantity: -1 });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid quantity");
    });

    it("should remove an item from the cart", async () => {
        expect(createdItemId).toBeTruthy();

        const response = await request(baseUrl)
            .delete(`/api/cart/${userId}/item/${createdItemId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("should clear all items in the cart", async () => {
        const response = await request(baseUrl)
            .delete(`/api/cart/${userId}`)
            .set("x-user-id", userId)
            .set("x-user-role", "CUSTOMER")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.message).toBe("Cart cleared");
    });
});
