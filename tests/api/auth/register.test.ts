import request from "supertest";

describe("POST /api/auth/register", () => {
    const baseUrl = "http://localhost:3000";

    it("should register a new user successfully", async () => {
        const newUser = {
            email: `testuser_${Date.now()}@example.com`,
            password: "123456",
            name: "Test User",
        };

        const response = await request(baseUrl)
            .post("/api/auth/register")
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.email).toBe(newUser.email);
    });

    it("should return error if email is already registered", async () => {
        const existingUser = {
            email: "user@example.com",
            password: "password123",
            name: "Duplicate User",
        };

        const response = await request(baseUrl)
            .post("/api/auth/register")
            .send(existingUser);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User with this email already exists");
    });

    it("should return validation error for invalid data", async () => {
        const invalidUser = {
            email: "invalidemail",
            password: "",
            name: "",
        };

        const response = await request(baseUrl)
            .post("/api/auth/register")
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid data");
    });
});