import prisma from '../../prisma/index';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
        res.status(400).json({ error: 'Email, password, and role are required' });
        return 
    }

    try {
        let user;

        if (role === 'user') {
            user = await prisma.users.findUnique({ where: { userEmail: email } });
        } else if (role === 'organizer') {
            user = await prisma.organizers.findUnique({ where: { organizerEmail: email } });
        } else {
            res.status(400).json({ error: 'Invalid role specified' });
            return 
        }

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return 
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user[`${role}Password`]);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid password' });
            return 
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;