import prisma from '../../prisma';
import express, { Request, Response } from 'express';

interface BattingStat {
    scorecardId: number;
    playerName: string;
    teamName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissal: string;
}

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
    const { scorecardId, playerName, teamName, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId || !playerName || !teamName || !runs || !balls || !fours || !sixes || !strikeRate || !dismissal) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

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
    const { scorecardId, playerName, teamName, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId || !playerName || !teamName || !runs || !balls || !fours || !sixes || !strikeRate || !dismissal) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const updatedBattingStat = await prisma.battingStats.update({
            where: { battingStatsId: parseInt(id) },
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