import request from 'supertest';
import dotenv from "dotenv";

dotenv.config();
let createdOrderId: string;

describe('GET /api/orders', () => {
    it('should return all orders for ADMIN', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/orders')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return orders only for the current user', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/orders')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/orders')
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Unauthorized');
    });
});

describe('POST /api/orders', () => {
    it('should create an order from the cart', async () => {
        const cartData = {
            userId: 'e262dd1c-62bd-4673-92f0-71ad803f0f4a',
            items: [
                { productId: '72d74724-734a-4e9a-a497-6241ddb3cca2', quantity: 2 },
            ],
        };

        const response = await request('http://localhost:3000')
            .post('/api/orders')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER')
            .send(cartData);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.items.length).toBeGreaterThan(0);
        createdOrderId = response.body.data.id;
    });

    it('should return 400 if cart is empty', async () => {
        const emptyCartData = { userId: 'e262dd1c-62bd-4673-92f0-71ad803f0f4a', items: [] };

        const response = await request('http://localhost:3000')
            .post('/api/orders')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER')
            .send(emptyCartData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Cart is empty');
    });
});

describe('GET /api/orders/:id', () => {
    const orderId = '492b3791-5187-4e6e-82fe-d3ab6214a782';

    it('should return the order by id for the user or ADMIN', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(orderId);
    });

    it('should return 403 if user tries to access another user’s order', async () => {
        const orderId = '8c6fd6ef-5974-4c53-8983-b362d9d5681c';

        const response = await request('http://localhost:3000')
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', '8b8e4b59-3888-46a3-9fa7-e6cc9d4f8ef4')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Forbidden');
    });

    it('should return 404 if order not found', async () => {
        const orderId = '4932127-1bb3-4dc1-8900-401b59acb155';

        const response = await request('http://localhost:3000')
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Order not found');
    });
});

describe('DELETE /api/orders/:id', () => {
    it('should delete the order by id for the user or ADMIN', async () => {
        const orderId = createdOrderId;

        const response = await request('http://localhost:3000')
            .delete(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe('Order deleted');
    });

    it('should return 403 if user tries to delete another user’s order', async () => {
        const orderId = '8c6fd6ef-5974-4c53-8983-b362d9d5681c';

        const response = await request('http://localhost:3000')
            .delete(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', '8b8e4b59-3888-46a3-9fa7-e6cc9d4f8ef4')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Forbidden');
    });

    it('should return 404 if order not found', async () => {
        const orderId = '49327434-1bb3-4dc1-8900-401b59acb155';

        const response = await request('http://localhost:3000')
            .delete(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Order not found');
    });
});

describe('GET /api/orders/user/:userId', () => {
    it('should return orders for the user', async () => {
        const userId = 'e262dd1c-62bd-4673-92f0-71ad803f0f4a';
        const orderId = '49327434-1bb3-4dc1-8900-401b59acb155'

        const response = await request('http://localhost:3000')
            .get(`/api/orders/${orderId}/user/${userId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', userId)
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 403 if userId does not match', async () => {
        const wrongUserId = '1881f55f-e856-49bb-9582-cf8245f9c78f';
        const orderId = 'e262dd1c-62bd-4673-92f0-71ad803f0f4a'

        const response = await request('http://localhost:3000')
            .get(`/api/orders/${orderId}/user/${wrongUserId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .set('x-user-id', 'e262dd1c-62bd-4673-92f0-71ad803f0f4a')
            .set('x-user-role', 'CUSTOMER');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Forbidden');
    });
});