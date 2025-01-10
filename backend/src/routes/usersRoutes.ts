import { Router, Request, Response } from 'express';
import prisma from '../../prisma/index';
import bcrypt from 'bcrypt';

interface User {
    userName: string;
    userEmail: string;
    userPassword: string;
}

const router = Router();

//Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
})

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    const { userName, userEmail, userPassword }: User = req.body;

    if (!userName || !userEmail || !userPassword) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await prisma.users.create({
            data: {
                userName,
                userEmail,
                userPassword: hashedPassword,
            },
        });

        res.status(201).json(user);
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Update a user
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userName, userEmail, userPassword }: User = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    if(!userName || !userEmail || !userPassword) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
  
    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await prisma.users.update({
            where: { userId: Number(id) },
            data: {
                userName,
                userEmail,
                userPassword: hashedPassword
            },
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

//Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        const user = await prisma.users.delete({
            where: { userId: Number(id) },
        });
        res.status(200).json(user);
    } catch (err) {
        console.error('Error deleting user:', err);

        if (
            err instanceof Error &&
            'code' in err &&
            (err as { code: string }).code === 'P2025'
        ) {
            res.status(404).json({ error: 'User not found' });
        } 
        else {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
});


export default router;
