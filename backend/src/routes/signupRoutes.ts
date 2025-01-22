import prisma from "../../prisma";
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

interface User {
    email: string;
    password: string;
    role: string;
    name: string;
}

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { email, password, role, name }: User = req.body;

    if (!email || !password || !role || !name) {
        res.status(400).json({ error: 'Email, password, role, and name are required' });
        return 
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        if (role === 'user') {
            newUser = await prisma.users.create({
                data: {
                    userEmail: email,
                    userPassword: hashedPassword,
                    userName: name,
                },
            });
        } else if (role === 'organizer') {
            newUser = await prisma.organizers.create({
                data: {
                    organizerEmail: email,
                    organizerPassword: hashedPassword,
                    organizerName: name,
                },
            });
        } else {
            res.status(400).json({ error: 'Invalid role specified' });
            return 
        }

        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;