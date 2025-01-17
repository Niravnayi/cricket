import express, { Request, Response } from 'express';
import prisma from '../../prisma';

interface Match {
    tournamentId: number;
    firstTeamId: number;
    firstTeamName: string;
    secondTeamId: number;
    secondTeamName: string;
    dateTime: Date;
    venue: string;
    isLive: boolean;
    result: string;
    isCompleted: boolean
}

const router = express.Router();

// Get all matches
router.get('/', async (req: Request, res: Response) => {
    try {
        const matches = await prisma.matches.findMany({
            include: { scorecard: true },
        });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching matches' });
    }
});

// Get a specific match
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const match = await prisma.matches.findUnique({
            where: { 
                matchId: parseInt(id) 
            },
            include: { 
                scorecard: true 
            },
        });
        res.json(match);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching match' });
    }
});

// Create a new match
router.post('/', async (req: Request, res: Response) => {
    const { tournamentId, firstTeamId, secondTeamId, venue, dateTime }: Match = req.body;

    try {
        // Fetch team names for the given team IDs
        const [firstTeam, secondTeam] = await Promise.all([
            prisma.teams.findUnique({
                where: { teamId: firstTeamId },
                select: { teamName: true },
            }),
            prisma.teams.findUnique({
                where: { teamId: secondTeamId },
                select: { teamName: true },
            }),
        ]);

        // Check if teams were found
        if (!firstTeam || !secondTeam) {
            res.status(404).json({ error: 'One or both teams not found' });
            return 
        }

        // Create the match with team names dynamically fetched
        const newMatch = await prisma.matches.create({
            data: {
                tournamentId,
                firstTeamId,
                secondTeamId,
                firstTeamName: firstTeam.teamName, 
                secondTeamName: secondTeam.teamName, 
                venue,
                dateTime: new Date(dateTime),
                result: 'Pending',
                isLive: false,
                isCompleted: false,
            },
        });

        res.status(201).json(newMatch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating match' });
    }
});


// Update a match
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tournamentId, firstTeamId, secondTeamId, venue, dateTime }: Match = req.body;

    try {
        // Fetch team names for the given team IDs
        const [firstTeam, secondTeam] = await Promise.all([
            prisma.teams.findUnique({
                where: { teamId: firstTeamId },
                select: { teamName: true },
            }),
            prisma.teams.findUnique({
                where: { teamId: secondTeamId },
                select: { teamName: true },
            }),
        ]);

        // Check if teams were found
        if (!firstTeam || !secondTeam) {
            res.status(404).json({ error: 'One or both teams not found' });
            return 
        }

        // Update the match with new details
        const updatedMatch = await prisma.matches.update({
            where: { matchId: parseInt(id) },
            data: {
                tournamentId,
                firstTeamId,
                secondTeamId,
                firstTeamName: firstTeam.teamName, 
                secondTeamName: secondTeam.teamName, 
                venue,
                dateTime: new Date(dateTime),
            },
        });

        res.json(updatedMatch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating match' });
    }
});


// Delete a match
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.matches.delete({
            where: { 
                matchId: parseInt(id) 
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting match' });
    }
});

export default router;