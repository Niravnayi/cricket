import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'

interface Team {
    teamName: string;
    tournamentId: number;
    playerIds: number[];
}

const router = express.Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
    try {
        const teams = await prisma.teams.findMany({
            include: { players: { include: { player: true } } },
        });
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// Create a new team
router.post('/', async (req: Request, res: Response) => {
    const { teamName, tournamentId, playerIds }: Team = req.body;

    if (!teamName || !tournamentId || !Array.isArray(playerIds)) {
        res.status(400).json({ error: 'Missing required fields or invalid playerIds' });
        return;
    }

    try {
        const team = await prisma.teams.create({
            data: {
                teamName,
                tournamentId,
                players: {
                    create: playerIds.map((playerId: number) => ({ playerId })),
                },
            },
            include: { players: true },
        });

        res.status(201).json(team);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

// Add a player to a team
router.post('/:teamId/players', async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { playerId } = req.body;

    try {
        const teamPlayer = await prisma.teamPlayer.create({
            data: { teamId: parseInt(teamId), playerId },
        });

        res.status(201).json(teamPlayer);
    } catch (error) {
        console.error('Error adding player to team:', error);
        res.status(500).json({ error: 'Failed to add player to team' });
    }
});

// Remove a player from a team
router.delete('/:teamId/players/:playerId', async (req: Request, res: Response) => {
    const { teamId, playerId } = req.params;

    try {
        await prisma.teamPlayer.delete({
            where: {
                teamId_playerId: {
                    teamId: parseInt(teamId),
                    playerId: parseInt(playerId),
                },
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error removing player from team:', error);
        res.status(500).json({ error: 'Failed to remove player from team' });
    }
});

export default router;
