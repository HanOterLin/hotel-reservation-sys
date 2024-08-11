import { hashPassword, comparePassword } from '../hash_password';

describe('Password hashing and comparison', () => {
    const password = 'testpassword';
  
    it('should hash a password correctly', async () => {
        const hashedPassword = await hashPassword(password);
    
        // diff
        expect(hashedPassword).not.toBe(password);

        // length
        expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should return true when comparing correct password', async () => {
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(password, hashedPassword);
    
        expect(isMatch).toBe(true);
    });

    it('should return false when comparing incorrect password', async () => {
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword('wrongpassword', hashedPassword);
    
        expect(isMatch).toBe(false);
    });
});
