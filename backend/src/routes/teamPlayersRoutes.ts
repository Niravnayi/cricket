import prisma from '../../prisma';
import express, { Request, Response } from 'express';

const router = express.Router();

// Get all teamPlayers
router.get('/team/:teamId', async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        const players = await prisma.teamPlayer.findMany({
            where: { teamId: Number(teamId) },
            include: { player: true },
        });

        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players of a team:', error);
        res.status(500).json({ error: 'Failed to fetch players of a team' });
    }
});

// Add players to a team
router.post('/', async (req: Request, res: Response) => {
    const { teamId, playerIds } = req.body;

    if (!teamId || !Array.isArray(playerIds)) {
        res.status(400).json({ error: 'Missing teamId or invalid playerIds' });
        return 
    }

    try {
        const entries = playerIds.map((playerId: number) => ({ teamId, playerId }));
        const teamPlayers = await prisma.teamPlayer.createMany({ data: entries });

        res.status(201).json({ message: 'Players added to team successfully', teamPlayers });
    } catch (error) {
        console.error('Error adding players to team:', error);
        res.status(500).json({ error: 'Failed to add players to team' });
    }
});

// Update a player in a team
router.put('/:teamId/:playerId', async (req: Request, res: Response) => {
    const { teamId, playerId } = req.params;
    const { teamId: updatedTeamId, playerId: updatedPlayerId } = req.body;

    try {
        const teamPlayer = await prisma.teamPlayer.update({
            where: { teamId_playerId: { teamId: Number(teamId), playerId: Number(playerId) } },
            data: { teamId: updatedTeamId, playerId: updatedPlayerId },
        });

        res.status(200).json({ message: 'Player updated in team successfully', teamPlayer });
    } catch (error) {
        console.error('Error updating player in team:', error);
        res.status(500).json({ error: 'Failed to update player in team' });
    }
})

// Remove a player from a team
router.delete('/:teamId/:playerId', async (req: Request, res: Response) => {
    const { teamId, playerId } = req.params;

    try {
        const teamPlayer = await prisma.teamPlayer.delete({
            where: { teamId_playerId: { teamId: Number(teamId), playerId: Number(playerId) } },
        });

        res.status(200).json({ message: 'Player removed from team successfully', teamPlayer });
    } catch (error) {    
        console.error('Error removing player from team:', error);
        res.status(500).json({ error: 'Failed to remove player from team' });
    }
})
export default router;
