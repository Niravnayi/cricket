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
    const { scorecardId, playerId, teamName, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId || !teamName || !runs || !balls || !fours || !sixes || !strikeRate || !dismissal) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const player = await prisma.teamPlayer.findUnique({
        where: {
                id: playerId
        }
    });
    const playerName = player ? player.playerName : '';
    try {
        const newBattingStat = await prisma.battingStats.create({
            data: {
                scorecardId,
                playerName,
                teamName,
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
    const { playerName, updatedPlayerStats } = req.body;
  
    try {
      const updatedMatch = await prisma.battingStats.updateMany({
        where: {
            scorecardId : Number(id),
          playerName: playerName,
        },
        data: updatedPlayerStats,
      });
  
      res.json(updatedMatch);
    } catch (error) {
      console.error('Error updating player stats:', error);
      res.status(500).json({ error: 'Error updating player stats' });
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