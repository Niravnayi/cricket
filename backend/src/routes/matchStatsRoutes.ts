import express, { Request, Response } from 'express';
import prisma from '../../prisma';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const {
        team1Stats, 
        team1Id,
        team2Id,
        matchId,
        team2Stats, 
    } = req.body;
    try {
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
        const matchStatsData = [
            ...team1Stats.map((playerStats: { playerName: string; runs: number; wickets: number; balls: number; overs: string }) => ({
                matchId: matchId,
                playerName: playerStats.playerName,
                teamId: team1Id,
                teamName: team1.teamName,
                runs: playerStats.runs,
                wickets: playerStats.wickets,
                balls: playerStats.balls,
                overs: playerStats.overs,
            })),
            ...team2Stats.map((playerStats: { playerName: string; runs: number; wickets: number; balls: number; overs: string }) => ({
                matchId: matchId,
                playerName: playerStats.playerName,
                teamId: team2Id,
                teamName: team2.teamName,
                runs: playerStats.runs,
                wickets: playerStats.wickets,
                balls: playerStats.balls,
                overs: playerStats.overs,
            })),
        ];

        // Insert match stats entries
        const createdStats = await prisma.matchStats.createMany({
            data: matchStatsData,
        });

        if (createdStats.count === 0) {
            res.status(400).json({ error: 'Failed to create player stats' });
            return;
        }

        res.status(201).json({
            message: 'Match and player stats added successfully',
        });

    } catch (err) {
        console.error('Error creating match and player stats:', err);
        res.status(500).json({ error: 'Failed to create match and player stats' });
    }
});

export default router;
