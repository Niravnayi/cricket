import prisma from '../../prisma';
import express, { Request, Response } from 'express';
import { io } from '../index';

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
    const { teamId, playerIds, playerName } = req.body;

    if (!teamId || !Array.isArray(playerIds || !playerName)) {
        res.status(400).json({ error: 'Missing teamId or invalid playerIds' });
        return 
    }

    try {
        const entries = playerIds.map((playerId: number) => ({ teamId, playerId, playerName }));
        const teamPlayers = await prisma.teamPlayer.createMany({ data: entries });

        io.emit('teamPlayersCreated', teamPlayers);
        res.status(201).json({ message: 'Players added to team successfully', teamPlayers });
    } catch (error) {
        console.error('Error adding players to team:', error);
        res.status(500).json({ error: 'Failed to add players to team' });
    }
});

// Update a player in a team
router.put('/:teamId/:playerId', async (req: Request, res: Response) => {
    const { teamId, playerId, playerName } = req.params;
    const { teamId: updatedTeamId, playerId: updatedPlayerId, playerName: updatedPlayerName } = req.body;

    try {
        const teamPlayer = await prisma.teamPlayer.update({
            where: { teamId_playerId: { teamId: Number(teamId), playerId: Number(playerId) } },
            data: { teamId: updatedTeamId, playerId: updatedPlayerId, playerName: updatedPlayerName },
        });

        io.emit('teamPlayerUpdated', teamPlayer);
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

        io.emit('teamPlayerRemoved', teamPlayer);
        res.status(200).json({ message: 'Player removed from team successfully', teamPlayer });
    } catch (error) {    
        console.error('Error removing player from team:', error);
        res.status(500).json({ error: 'Failed to remove player from team' });
    }
})
export default router;
