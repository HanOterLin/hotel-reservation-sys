import { signToken, verifyToken } from '../jwt';

describe('JWT sign and verify', () => {
    const payload = { id: 1, username: 'testuser' };

    it('should sign a token with the given payload', () => {
        const token = signToken(payload, '1h');
    
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should verify a valid token and return the payload', () => {
        const token = signToken(payload, '1h');
        const decoded = verifyToken(token);
    
        expect(decoded).toHaveProperty('id', 1);
        expect(decoded).toHaveProperty('username', 'testuser');
    });

    it('should throw an error for an invalid token', () => {
        const invalidToken = 'invalid.token.here';
    
        expect(() => verifyToken(invalidToken)).toThrow('invalid token');
    });

    it('should throw an error for an expired token', async () => {
        const token = signToken(payload, '1ms');
        await new Promise(resolve => setTimeout(resolve, 10));
    
        expect(() => verifyToken(token)).toThrow('jwt expired');
    });
});
