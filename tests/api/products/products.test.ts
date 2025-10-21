import request from 'supertest';
import dotenv from "dotenv";

dotenv.config();

let createdProductId: string;

describe('GET /api/products', () => {
    it('should return products filtered by categoryId', async () => {
        const categoryId = 'a34e764a-2a60-418f-9df3-537a8a646f41';

        const response = await request('http://localhost:3000')
            .get('/api/products')
            .query({ categoryId });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return all products if no categoryId is provided', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/products');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});


describe('POST /api/products', () => {

    it('should create a new product', async () => {
        const productData = {
            name: `New Product ${Date.now()}`,
            price: 199.99,
            stock: 5,
            categoryId: 'a34e764a-2a60-418f-9df3-537a8a646f41',
        };

        const response = await request('http://localhost:3000')
            .post('/api/products')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN')
            .send(productData);

        expect(response.status).toBe(201);
        createdProductId = response.body.data.id; // сохраняем id для удаления
    });

    it('should return 400 if invalid data is provided', async () => {
        const invalidProductData = {
            name: '',
            price: -10,
        };

        const response = await request('http://localhost:3000')
            .post('/api/products')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN')
            .send(invalidProductData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid data');
    });
});

describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
        const productId = '72d74724-734a-4e9a-a497-6241ddb3cca2';

        const response = await request('http://localhost:3000')
            .get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(productId);
        expect(response.body.data.name).toBeDefined();
    });

    it('should return 404 if product not found', async () => {
        const productId = '44d74724-734a-4e8a-a497-6241ddb34ca2';

        const response = await request('http://localhost:3000')
            .get(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
    });
});

describe('PUT /api/products/:id', () => {
    it('should update the product', async () => {
        const productId = '72d74724-734a-4e9a-a497-6241ddb3cca2';
        const updatedProductData = {
            name: 'Updated Product Name',
            price: 249.99,
            stock: 10,
        };

        const response = await request('http://localhost:3000')
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN')
            .send(updatedProductData);

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe(updatedProductData.name);
        expect(response.body.data.price).toBe(updatedProductData.price);
    });

    it('should return 404 if product not found', async () => {
        const productId = '44d74724-734a-4e8a-a497-6241ddb34ca2';
        const updatedProductData = {
            name: 'Updated Product Name',
            price: 249.99,
        };

        const response = await request('http://localhost:3000')
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN')
            .send(updatedProductData);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
    });
});

describe('DELETE /api/products/:id', () => {
    it('should delete the product', async () => {
        const productId = createdProductId;

        const response = await request('http://localhost:3000')
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe('Product deleted');
    });

    it('should return 404 if product not found', async () => {
        const productId = '44d74724-734a-4e8a-a497-6241ddb34ca2';

        const response = await request('http://localhost:3000')
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN_ADMIN}`)
            .set('x-user-id', '1881f55f-e826-49bb-9582-cf8245f9c78f')
            .set('x-user-role', 'ADMIN');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
    });
});