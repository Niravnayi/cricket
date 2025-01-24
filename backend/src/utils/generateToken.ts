import jwt from 'jsonwebtoken';

export const generateToken = (id: number | string, role: string) => {
    const payload = { id, role };
    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
};