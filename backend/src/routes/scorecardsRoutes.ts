import express, { Request, Response } from 'express';
import prisma from '../../prisma';
import { Scorecard } from '../types/scorecardRoute';

const router = express.Router();

// Scorecard Routes
router.get('/', async (req: Request, res: Response) => {
    try {
        const scorecards = await prisma.scorecard.findMany({
            include: { match: true, battingStats:true ,bowlingStats:true},
        });
        res.json(scorecards);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching scorecards' });
    }
});

// Get a specific scorecard
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const scorecard = await prisma.scorecard.findUnique({
            where: { scorecardId: parseInt(id) },
            include: { 
                match: true,
                battingStats: true, 
                bowlingStats: true,    
                extras: true,           
             },
        });
        res.json(scorecard);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching scorecard' });
    }
});

// Create a new scorecard
router.post('/', async (req: Request, res: Response) => {
    const { matchId, teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers }: Scorecard = req.body;

    if (!matchId || !teamAScore || !teamBScore || !teamAWickets || !teamBWickets || !teamAOvers || !teamBOvers) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const newScorecard = await prisma.scorecard.create({
            data: {
                matchId,
                teamAScore,
                teamBScore,
                teamAWickets,
                teamBWickets,
                teamAOvers,
                teamBOvers,
            },
        });
        res.status(201).json(newScorecard);
    } catch (error) {
        res.status(500).json({ error: 'Error creating scorecard' });
    }
});

// Update a scorecard
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers }: Scorecard = req.body;

    if (!teamAScore || !teamBScore || !teamAWickets || !teamBWickets || !teamAOvers || !teamBOvers) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    try {
        const updatedScorecard = await prisma.scorecard.update({
            where: { scorecardId: parseInt(id) },
            data: { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers },
        });
        res.json(updatedScorecard);
    } catch (error) {
        res.status(500).json({ error: 'Error updating scorecard' });
    }
});

// Delete a scorecard
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.scorecard.delete({
            where: { scorecardId: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting scorecard' });
    }
});

export default router;