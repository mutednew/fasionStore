import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:3000";
const USER_ID = "e262dd1c-62bd-4673-92f0-71ad803f0f4a";
const PRODUCT_ID = "72d74724-734a-4e9a-a497-6241ddb3cca2";
const ADMIN_ID = "1881f55f-e826-49bb-9582-cf8245f9c78f";

describe("End-to-End Flow: Cart → Order → Fetch → Delete", () => {
    let createdOrderId: string;

    it("should create an order from the cart", async () => {
        const cartData = {
            userId: USER_ID,
            items: [
                { productId: PRODUCT_ID, quantity: 2 },
            ],
        };

        const response = await request(BASE_URL)
            .post("/api/orders")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .set("x-user-id", USER_ID)
            .set("x-user-role", "CUSTOMER")
            .send(cartData);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("id");

        createdOrderId = response.body.data.id; // ✅ сохраняем ID заказа
        console.log("Создан заказ:", createdOrderId);
    });

    it("should fetch the created order by id", async () => {
        const response = await request(BASE_URL)
            .get(`/api/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .set("x-user-id", USER_ID)
            .set("x-user-role", "CUSTOMER");

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(createdOrderId);
    });

    it("should show the order in user orders list", async () => {
        const response = await request(BASE_URL)
            .get(`/api/orders/${USER_ID}/user/${USER_ID}`)
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .set("x-user-id", USER_ID)
            .set("x-user-role", "CUSTOMER");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.some((o: any) => o.id === createdOrderId)).toBe(true);
    });

    it("should allow ADMIN to delete the order", async () => {
        const response = await request(BASE_URL)
            .delete(`/api/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set("x-user-id", ADMIN_ID)
            .set("x-user-role", "ADMIN");

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("Order deleted");
    });

    it("should return 404 if deleted order is fetched again", async () => {
        const response = await request(BASE_URL)
            .get(`/api/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN}`)
            .set("x-user-id", USER_ID)
            .set("x-user-role", "CUSTOMER");

        expect(response.status).toBe(404);
    });
});
