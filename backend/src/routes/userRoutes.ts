import { Router, Request, Response } from 'express';
import prisma from '../../prisma/index';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json(user);
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid user ID' });
        return; 
    }

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
        const saltRounds = 10;
        try {
            updateData.password = await bcrypt.hash(password, saltRounds);
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            res.status(500).json({ error: 'Failed to hash password' });
            return; 
        }
    }

    try {
        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: updateData,
        });

        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating user:', err);

        if (
            err instanceof Error &&
            'code' in err &&
            (err as { code: string }).code === 'P2025'
        ) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Failed to update user' });
        }
    }
});


export default router;
