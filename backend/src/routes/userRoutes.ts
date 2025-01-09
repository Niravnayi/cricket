import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password
            }
        });

        res.status(201).json(user);
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;
