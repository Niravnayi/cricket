import express, { Request, Response } from 'express';
import prisma from '../../prisma';
import { Scorecard } from '../types/scorecardRoute';
import { io } from '../index';

const router = express.Router();

// Scorecard Routes
router.get('/', async (req: Request, res: Response) => {
    try {
        const scorecards = await prisma.scorecard.findMany({
            include: { match: true,battingStats: true, bowlingStats: true, extras: true },

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
    console.log(req.body)
    const { matchId, teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers }: Scorecard = req.body;
    console.log(matchId, teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers)
    if (matchId === undefined ||
        teamAScore === undefined ||
        teamBScore === undefined ||
        teamAWickets === undefined ||
        teamBWickets === undefined ||
        teamAOvers === undefined ||
        teamBOvers === undefined) {
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

        io.emit('scoreCreate', newScorecard);
        res.status(201).json(newScorecard);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

// Update a scorecard
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers }: Scorecard = req.body;
    console.log(teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers)
    if (!teamAScore===undefined || !teamBScore===undefined || !teamAWickets===undefined || !teamBWickets===undefined || !teamAOvers===undefined || !teamBOvers===undefined) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const updatedScorecard = await prisma.scorecard.update({
            where: { scorecardId: parseInt(id) },
            data: { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers },
        });

        io.emit('scoreUpdate', updatedScorecard);
        res.json(updatedScorecard);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating scorecard' });
    }
});

// Delete a scorecard
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedScorecard = await prisma.scorecard.delete({
            where: { scorecardId: parseInt(id) },
        });

        // io.emit('scorecardDeleted', deletedScorecard);
        res.status(200).json({ message: 'Scorecard deleted successfully', deletedScorecard });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting scorecard' });
    }
});

export default router;