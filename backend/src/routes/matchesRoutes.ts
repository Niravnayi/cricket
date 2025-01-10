import express, { Request, Response } from 'express';
import prisma from '../../prisma';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {

    const {
        tournamentId,
        team1Id,
        team2Id,
    } = req.body;
    
    
    try {
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId: tournamentId },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament does not exist' });
            return;
        }

        const team1 = await prisma.teams.findUnique({
            where: { teamId: team1Id },
            select: { teamName: true },
        });
        
        const team2 = await prisma.teams.findUnique({
            where: { teamId: team2Id },
            select: { teamName: true },
        });

        if (!team1 || !team2) {
            res.status(404).json({ error: 'One or both teams do not exist' });
            return; 
        }
        const newMatch = await prisma.matches.create({
            data: {
                tournamentName: tournamentExists.tournamentName,
                tournamentId: tournamentExists.tournamentId,
                team1Id: team1Id,
                team1Name: team1.teamName,
                team2Id: team2Id,
                team2Name: team2.teamName,
            },
        });
        console.log(newMatch)    
        res.status(201).json({
            message: 'Match and player stats added successfully',
            match: newMatch,
        });
    } catch (err) {
        console.error('Error creating match and player stats:', err);
        res.status(500).json({ error: 'Failed to create match and player stats' });
    }
});

export default router;
