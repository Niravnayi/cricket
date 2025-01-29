import prisma from '../../prisma';
import express, { Request, Response } from 'express';
import { BowlingStat } from '../types/bowlingStatsRoute';
import { io } from '../index';

const router = express.Router();

// Get all bowling stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const bowlingStats = await prisma.bowlingStats.findMany();
        io.emit('allBowlingStats', {bowlingStats})
        res.json(bowlingStats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bowling stats' });
    }
});


// Post a new bowling stat
router.post('/', async (req, res) => {
    const { scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate }: BowlingStat = req.body;

    if (!scorecardId==undefined || !playerId==undefined || !teamId==undefined || !overs==undefined || !maidens==undefined || !runsConceded==undefined || !wickets==undefined || !economyRate==undefined) {
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
                playerId,
                overs,
                maidens,
                runsConceded,
                wickets,
                economyRate,
            },
        });

        // io.emit('bowlingStats', newBowlingStat);
        res.status(201).json(newBowlingStat);
    } catch (error) {
        res.status(500).json({ error: 'Error adding bowling stats' });
    }
});

// Update a bowling stat
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bowlingStatsId,scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate }: BowlingStat = req.body;
    console.log(scorecardId)
    if (!scorecardId==undefined || !playerId==undefined || !teamId==undefined || !overs==undefined || !maidens==undefined || !runsConceded==undefined || !wickets==undefined || !economyRate==undefined) {
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
            where: { bowlingStatsId: bowlingStatsId },
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


        // io.emit('bowlingStats', updatedBowlingStat);
        res.json(updatedBowlingStat);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating bowling stats' });
    }
});

// Delete a bowling stat
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedBowlingStat = await prisma.bowlingStats.delete({
            where: { bowlingStatsId: parseInt(id) },
        });

        // io.emit('bowlingStats', deletedBowlingStat);
        res.status(200).json({message: "Bowling stat deleted successfully", deletedBowlingStat});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting bowling stats' });
    }
})

export default router;