import request from 'supertest';
import {app, server, mongoose} from '../index';

describe('Auth Endpoints', () => {
    const username = 'testuser_' + Date.now();
    const password = 'testpassword_' + Date.now();
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username,
                password,
                role: 'guest'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', username);
        expect(res.body).toHaveProperty('role', 'guest');
        expect(res.body).toHaveProperty('accessToken');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                username,
                password
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    afterAll((done) => {
        mongoose.disconnect().finally(() => server.close(done));
    });
});
