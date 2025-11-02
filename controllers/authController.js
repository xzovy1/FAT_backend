const prisma = require('../prisma/client.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'username and password required' });
        }

        const user = await prisma.user.findUnique({
            where: { username },
            include: { technician: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                is_admin: user.is_admin,
                technicianId: user.technician?.id ?? null
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { login };