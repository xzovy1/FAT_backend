const prisma = require('../prisma/client.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { technician: true }
        });

        if (!user || !user.active) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last_login timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { last_login: new Date() }
        });

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
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
