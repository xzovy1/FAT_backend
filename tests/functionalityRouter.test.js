const { login } = require('../controllers/authController');

jest.mock('../prisma/client.js', () => ({
    user: { findUnique: jest.fn() }
}));

jest.mock('../middleware/auth', () => ({
    generateToken: jest.fn(() => 'generated-token')
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn()
}));

const prisma = require('../prisma/client.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

describe('authController', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        jest.clearAllMocks();
    });

    test('login returns token and user on valid credentials', async () => {
        req.body = { username: 'alice', password: 'secret' };
        prisma.user.findUnique.mockResolvedValue({
            id: 1, username: 'alice', password_hash: 'hash', is_admin: false, technician: { id: 2 }
        });
        bcrypt.compare.mockResolvedValue(true);

        await login(req, res);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'alice' }, include: { technician: true } });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: 'generated-token',
            user: expect.objectContaining({ id: 1, username: 'alice' })
        }));
    });

    test('login rejects missing/invalid credentials', async () => {
        req.body = { username: 'bob', password: 'wrong' };
        prisma.user.findUnique.mockResolvedValue(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});