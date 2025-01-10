import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'

interface Team {
    teamName: string;
    tournamentId: number;
    playersName: string[];
}

const router = express.Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
    try {
        const teams = await prisma.teams.findMany();
        res.status(200).json(teams);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// Create a new team
router.post('/', async (req: Request, res: Response) => {
    const { teamName, tournamentId, playersName }: Team = req.body;

    try {
 
        if (!teamName || !tournamentId || !playersName) {
            res.status(400).json({ error: 'Missing required fields' });
            return; 
        }

        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament does not exist' });
            return;
        }

        const team = await prisma.teams.create({
            data: {
                tournamentName: tournamentExists.tournamentName,
                teamName,
                playersName,
                tournament: {   
                    connect: {
                        tournamentId, 
                    },
                },
            },
        });

        res.status(201).json(team);
    } catch (err) {
        console.error('Error creating team:', err);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

// Update a team
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { teamName, playersName }: Team = req.body;
    try {
        const team = await prisma.teams.update({
            where: { id: Number(id) },
            data: {
                teamName: teamName,
                playersName,
            },
        });
        res.status(200).json(team);
    } catch (err) {
        console.error('Error updating team:', err);
        res.status(500).json({ error: 'Failed to update team' });
    }
});

// Delete a team
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const team = await prisma.teams.delete({
            where: { id: Number(id) },
        });
        res.status(200).json(team);
    } catch (err) {
        console.error('Error deleting team:', err);
        res.status(500).json({ error: 'Failed to delete team' });
    }
});


export default router;
