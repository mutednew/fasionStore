import request from "supertest";

describe("POST /api/auth/login", () => {
    const baseUrl = "http://localhost:3000";

    it("should login the user and return a token", async () => {
        const response = await request(baseUrl)
            .post("/api/auth/login")
            .send({
                email: "user@example.com", // ✅ подставь реального юзера из БД
                password: "password123",              // ✅ реальный пароль
            });

        // Проверяем, что запрос прошёл
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Проверяем, что в ответе есть токен
        expect(response.body.data).toBeDefined();
        expect(response.body.data.token).toBeDefined();
        expect(typeof response.body.data.token).toBe("string");

        // Проверяем наличие пользователя в ответе
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.email).toBe("user@example.com");
    });

    it("should return error with invalid credentials", async () => {
        const response = await request(baseUrl)
            .post("/api/auth/login")
            .send({
                email: "newuser@example.com",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid email or password");
    });

    it("should return validation error for invalid data", async () => {
        const response = await request(baseUrl)
            .post("/api/auth/login")
            .send({
                email: "", // некорректные данные
                password: "",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid data");
    });
});