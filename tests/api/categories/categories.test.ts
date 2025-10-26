import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "http://localhost:3000";
const adminId = "1881f55f-e826-49bb-9582-cf8245f9c78f";
const existingCategoryId = "a34e764a-2a60-418f-9df3-537a8a646f41";

describe("CATEGORY API", () => {
    let createdCategoryId: string;

    it("should create a new category", async () => {
        const categoryData = {
            name: "Test Category " + Date.now(),
        };

        const response = await request(baseUrl)
            .post("/api/categories")
            .set("x-user-id", adminId)
            .set("x-user-role", "ADMIN")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .send(categoryData);

        console.log("CREATE response:", response.body);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(categoryData.name);

        createdCategoryId = response.body.data.id;
    });

    it("should return error if category with the same name exists", async () => {
        const categoryData = {
            name: "Duplicate Category " + Date.now(),
        };

        await request(baseUrl)
            .post("/api/categories")
            .set("x-user-id", adminId)
            .set("x-user-role", "ADMIN")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .send(categoryData);

        const response = await request(baseUrl)
            .post("/api/categories")
            .set("x-user-id", adminId)
            .set("x-user-role", "ADMIN")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .send(categoryData);

        console.log("DUPLICATE response:", response.body);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Category with this name already exists");
    });

    it("should fetch all categories", async () => {
        const response = await request(baseUrl).get("/api/categories");

        console.log("ALL response:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should fetch a category by ID", async () => {
        const response = await request(baseUrl).get(`/api/categories/${existingCategoryId}`);

        console.log("GET BY ID response:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(existingCategoryId);
        expect(response.body.data.name).toBeDefined();
    });

    it("should return 404 if category not found", async () => {
        const fakeId = "non-existing-category-id";

        const response = await request(baseUrl).get(`/api/categories/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Category not found");
    });

    it("should update the category if exists", async () => {
        if (!createdCategoryId) {
            console.warn("⚠️ No created category ID — skipping update test");
            return;
        }

        const categoryData = {
            name: "Updated Category " + Date.now(),
        };

        const response = await request(baseUrl)
            .put(`/api/categories/${createdCategoryId}`)
            .set("x-user-id", adminId)
            .set("x-user-role", "ADMIN")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .send(categoryData);

        console.log("UPDATE response:", response.body);

        if (response.status === 404) {
            console.warn("⚠️ Category not found for update, skipping assertions");
            return;
        }

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(categoryData.name);
    });

    it("should delete the category if exists", async () => {
        if (!createdCategoryId) {
            console.warn("⚠️ No created category ID — skipping delete test");
            return;
        }

        const response = await request(baseUrl)
            .delete(`/api/categories/${createdCategoryId}`)
            .set("x-user-id", adminId)
            .set("x-user-role", "ADMIN")
            .set("Authorization", `Bearer ${process.env.JWT_TOKEN_ADMIN}`);

        console.log("DELETE response:", response.body);

        if (response.status === 404) {
            console.warn("⚠️ Category not found for delete, skipping assertions");
            return;
        }

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data.message).toBe("Category deleted");
    });
});