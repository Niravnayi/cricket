import prisma from '../../prisma';
import express, { Request, Response } from 'express';
import { BattingStat } from '../types/battingStatsRoute';


const router = express.Router();

// Get all batting stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const battingStats = await prisma.battingStats.findMany();
        res.json(battingStats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching batting stats' });
    }
});

// Post a new batting stat
router.post('/', async (req: Request, res: Response) => {
    const { scorecardId, playerId, teamId, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId || !playerId || !teamId || !runs || !balls || !fours || !sixes || !strikeRate || !dismissal) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        
        const player = await prisma.players.findUnique({
            where: {
                playerId: playerId,
            },
        })

        const team = await prisma.teams.findUnique({
            where: {
                teamId: teamId,
            },
        })

        if (!player || !team) {
            res.status(404).json({ error: 'Player or Team not found' });
            return;
        }

        const newBattingStat = await prisma.battingStats.create({
            data: {
                scorecardId,
                playerName: player.playerName,
                teamName: team.teamName,
                runs,
                balls,
                fours,
                sixes,
                strikeRate,
                dismissal,
            },
        });
        res.status(201).json(newBattingStat);
    } catch (error) {
        res.status(500).json({ error: 'Error adding batting stats' });
    }
});

// Update a batting stat
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { scorecardId, playerId, teamId, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId || !playerId || !teamId || !runs || !balls || !fours || !sixes || !strikeRate || !dismissal) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {

        const player = await prisma.players.findUnique({
            where: {
                playerId: playerId,
            },
        })

        const team = await prisma.teams.findUnique({
            where: {
                teamId: teamId,
            },
        })

        if (!player || !team) {
            res.status(404).json({ error: 'Player or Team not found' });
            return;
        }

        const updatedBattingStat = await prisma.battingStats.update({
            where: { battingStatsId: parseInt(id) },
            data: {
                scorecardId,
                playerName: player.playerName,
                teamName: team.teamName,
                runs,
                balls,
                fours,
                sixes,
                strikeRate,
                dismissal,
            },
        });
        res.json(updatedBattingStat);
    } catch (error) {
        res.status(500).json({ error: 'Error updating batting stats' });
    }
});

// Delete a batting stat
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.battingStats.delete({
            where: { battingStatsId: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting batting stats' });
    }
});

export default router;