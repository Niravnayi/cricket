import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, organizerId, organizerName,teams } = req.body
    try {
        const users = await prisma.tournaments.create({
            data:{
                name: name,
                teamsName:teams,
                organizerName: organizerName,
                organizer: {
                    connect: {
                        id: organizerId
                    }
                }
            }
    });
        res.status(201).json({message:'tournament added successfully'})  
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;
