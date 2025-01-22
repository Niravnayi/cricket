import prisma from '../../prisma/index';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
        res.status(400).json({ error: 'Email, password, and role are required' });
        return;
    }

    try {
        let user;

        if (role === 'user') {
            user = await prisma.users.findUnique({ where: { userEmail: email } })
            if (!user || !user.userPassword) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.userPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            // Return user data for the 'user' role
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.userId,
                    email: user.userEmail,
                    role: 'user',
                    name: user.userName,
                }
            });
        } else if (role === 'organizer') {
            user = await prisma.organizers.findUnique({ where: { organizerEmail: email } });
            if (!user || !user.organizerPassword) {
                res.status(404).json({ error: 'Organizer not found' });
                return;
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.organizerPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid Credentials' });
                return;
            }

            // Return user data for the 'organizer' role
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.organizerId,
                    email: user.organizerEmail,
                    role: 'organizer',
                    name: user.organizerName,
                }
            });
        } else {
            throw new Error('Invalid role');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
});

export default router;
