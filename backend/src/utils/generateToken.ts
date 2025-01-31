import jwt from 'jsonwebtoken';

export const generateToken = (id: number | string, role: string) => {
    const payload = { id, role };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

