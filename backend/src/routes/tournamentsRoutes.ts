import express, { Request, Response } from 'express';
import prisma from '../../prisma/index';

interface Tournament {
    tournamentId: number;
    tournamentName: string;
    organizerId: number;
    teamsName: string[];
}   

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
    const { tournamentName, organizerId, teamsName }: Tournament = req.body;

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

// Update a tournament
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tournamentName, organizerId, teamsName }: Tournament = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid or missing tournament ID' });
        return;
    }

    try {
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId: Number(id) },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }

        if (organizerId) {
            const organizerExists = await prisma.organizers.findUnique({
                where: { id: organizerId },
            });

            if (!organizerExists) {
                res.status(404).json({ error: 'Organizer not found' });
                return;
            }
        }

        const updatedTournament = await prisma.tournaments.update({
            where: { tournamentId: Number(id) },
            data: {
                tournamentName,
                teamsName,
                organizer: {
                    connect: {
                        id: organizerId,
                    },
                }
            },
        });

        res.status(200).json(updatedTournament);
    } catch (err: any) {
        console.error('Error updating tournament:', err.message || err);
        res.status(500).json({ error: 'Failed to update tournament' });
    }
});

export default router;
