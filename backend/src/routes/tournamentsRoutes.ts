import express, { Request, Response } from 'express';
import prisma from '../../prisma/index';

const router = express.Router();

// Get all tournaments
router.get('/', async (req: Request, res: Response) => {
    try {
        const tournaments = await prisma.tournaments.findMany();
        res.status(200).json(tournaments);
    } catch (err) {
        console.error('Error fetching tournaments:', err);
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});

// Create a new tournament
router.post('/', async (req: Request, res: Response) => {
    const { tournamentName, organizerId, teamsName } = req.body;

    if (!tournamentName || !organizerId || !teamsName) {
        res.status(400).json({ error: 'Missing required fields: tournamentName, organizerId, or organizerName' });
        return;
    }

    try {
       
        const organizerExists = await prisma.organizers.findUnique({
            where: { id: organizerId },
        });

        if (!organizerExists) {
            res.status(404).json({ error: 'Organizer not found' });
            return;
        }

        const tournament = await prisma.tournaments.create({
            data: {
                tournamentName,
                teamsName: teamsName,
                organizer: {
                    connect: {
                        id: organizerId,
                    },
                },
            },
        });

        res.status(201).json(tournament);
    } catch (err) {
        console.error('Error creating tournament:', err);
        res.status(500).json({ error: 'Failed to create tournament' });
    }
});

export default router;
