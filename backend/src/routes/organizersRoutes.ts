import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'

const router = express.Router();

// Get all organizers
router.get('/', async (req: Request, res: Response) => {
    try {
        const organizers = await prisma.organizers.findMany();
        res.json(organizers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create a new organizer
router.post('/', async (req: Request, res: Response) => {
    const { organizerName, organizerEmail, organizerPassword } = req.body
    try {
        const organizer = await prisma.organizers.create({
            data: {
                 organizerName,
                 organizerEmail,
                 organizerPassword
            }
        });
        res.status(201).json(organizer);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all tournaments for a specific organizer
router.get('/tournaments/:organizerId', async (req: Request, res: Response) => {
    const { organizerId } = req.params;

    if (isNaN(Number(organizerId))) {
        res.status(400).json({ error: 'Invalid organizer ID' });
        return;
    }

    try {
        const tournaments = await prisma.tournaments.findMany({
            where: {
                organizerId: Number(organizerId), 
            },
        });

        if (tournaments.length === 0) {
            res.status(404).json({ message: 'No tournaments found for this organizer' });
            return; 
        }

        res.status(200).json(tournaments);
    } catch (err) {
        console.error('Error fetching tournaments:', err);

        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});


export default router;
