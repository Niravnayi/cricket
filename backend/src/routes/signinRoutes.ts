import prisma from '../../prisma/index';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    console.log(email,password,role);
    

    if (!email || !password || !role) {
        res.status(400).json({ error: 'Email, password, and role are required' });
        return;
    }

    try {
        let user;

        if (role === 'user') {
            user = await prisma.users.findUnique({ where: { userEmail: email } });
            if (!user || !user.userPassword) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.userPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid password' });
                return;
            }

        } else if (role === 'organizer') {
            user = await prisma.organizers.findUnique({ where: { organizerEmail: email } });
            if (!user || !user.organizerPassword) {
                res.status(404).json({ error: 'Organizer not found' });
                return;
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.organizerPassword);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid password' });
                return;
            }

        } else {
            res.status(400).json({ error: 'Invalid role specified' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
