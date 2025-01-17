import prisma from '../../prisma';
import express, { Request, Response } from 'express';
import { BowlingStat } from '../types/bowlingStatsRoute';

const router = express.Router();

// Get all bowling stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const bowlingStats = await prisma.bowlingStats.findMany();
        res.json(bowlingStats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bowling stats' });
    }
});

// Post a new bowling stat
router.post('/', async (req, res) => {
    const { scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate }: BowlingStat = req.body;

    if (!scorecardId || !playerId || !teamId || !overs || !maidens || !runsConceded || !wickets || !economyRate) {
        res.status(400).json({ error: 'Missing required fields' });
        return
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

        const newBowlingStat = await prisma.bowlingStats.create({
            data: {
                scorecardId,
                playerName: player.playerName,
                teamName: team.teamName,
                overs,
                maidens,
                runsConceded,
                wickets,
                economyRate,
            },
        });
        res.status(201).json(newBowlingStat);
    } catch (error) {
        res.status(500).json({ error: 'Error adding bowling stats' });
    }
});

// Update a bowling stat
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate }: BowlingStat = req.body;

    if (!scorecardId || !playerId || !teamId || !overs || !maidens || !runsConceded || !wickets || !economyRate) {
        res.status(400).json({ error: 'Missing required fields' });
        return
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

        const updatedBowlingStat = await prisma.bowlingStats.update({
            where: { bowlingStatsId: parseInt(id) },
            data: {
                scorecardId,
                playerName: player.playerName,
                teamName: team.teamName,
                overs,
                maidens,
                runsConceded,
                wickets,
                economyRate,
            },
        });
        res.json(updatedBowlingStat);
    } catch (error) {
        res.status(500).json({ error: 'Error updating bowling stats' });
    }
});

// Delete a bowling stat
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.bowlingStats.delete({
            where: { bowlingStatsId: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting bowling stats' });
    }
})

export default router;