import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/index';
import { generateToken } from '../utils/generateToken';

const router = express.Router();

router.post('/' , async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        res.status(400).json({ error: 'Email, password, and role are required' });
        return;
    }

    try {
        if (role === 'user') {

            const user = await prisma.users.findUnique({ where: { userEmail: email } });

            if (!user || !user.userPassword) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.userPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = generateToken(user.userId, role);
            res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.userId,
                    email: user.userEmail,
                    role,
                    name: user.userName,
                },
            });
        } else if (role === 'organizer') {
  
            const organizer = await prisma.organizers.findUnique({ where: { organizerEmail: email } });

            if (!organizer || !organizer.organizerPassword) {
                res.status(404).json({ error: 'Organizer not found' });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, organizer.organizerPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = generateToken(organizer.organizerId, role);
            res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: organizer.organizerId,
                    email: organizer.organizerEmail,
                    role,
                    name: organizer.organizerName,
                },
            });
        } else {
            res.status(400).json({ error: 'Invalid role' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;