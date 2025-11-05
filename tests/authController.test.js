const { login } = require('../controllers/authController');

jest.mock('../prisma/client.js', () => ({
    user: { findUnique: jest.fn(), update: jest.fn() }
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

    test('login returns token and user on valid credentials (email)', async () => {
        req.body = { email: 'alice@example.com', password: 'secret' };
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'alice@example.com',
            firstname: 'Alice',
            lastname: 'Liddell',
            password_hash: 'hash',
            is_admin: false,
            active: true,
            technician: { id: 2 }
        });
        bcrypt.compare.mockResolvedValue(true);

        await login(req, res);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'alice@example.com' }, include: { technician: true } });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: 'generated-token',
            user: expect.objectContaining({ id: 1, email: 'alice@example.com' })
        }));
    });

    test('login rejects missing credentials with 400', async () => {
        req.body = { email: '', password: '' };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});