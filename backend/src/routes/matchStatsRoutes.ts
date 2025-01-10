import express, { Request, Response } from 'express';
import prisma from '../../prisma';

interface PlayerStats {
    playerName: string;
    runs: number;
    wickets: number;
    balls: number;
    overs: string;
    matchId: number;
    teamId: number;
}

const router = express.Router();

// Get all match stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const matchStats = await prisma.matchStats.findMany();
        res.json(matchStats);
    } catch (err) {
        console.error('Error fetching match stats:', err);
        res.status(500).json({ error: 'Failed to fetch match stats' });
    }
});

// Get match stats by matchId
router.get('/:matchId', async (req: Request, res: Response) => {
    const { matchId } = req.params;
    try {
        const matchStats = await prisma.matchStats.findMany({ where: { matchId: Number(matchId) } });
        res.json(matchStats);
    } catch (err) {
        console.error('Error fetching match stats by matchId:', err);
        res.status(500).json({ error: 'Failed to fetch match stats by matchId' });
    }
});

// Create match and player stats
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { firstTeamStats, firstTeamId, secondTeamStats, secondTeamId, matchId } = req.body;

    try {
        const [firstTeam, secondTeam] = await Promise.all([
            prisma.teams.findUnique({ where: { teamId: firstTeamId }, select: { teamName: true } }),
            prisma.teams.findUnique({ where: { teamId: secondTeamId }, select: { teamName: true } })
        ]);

        if (!firstTeam || !secondTeam) {
            res.status(404).json({ error: 'One or both teams do not exist' });
            return;
        }

        const matchStatsData = [
            ...firstTeamStats.map((player: PlayerStats) => ({
                matchId,
                playerName: player.playerName,
                teamId: firstTeamId,
                teamName: firstTeam.teamName,
                runs: player.runs,
                wickets: player.wickets,
                balls: player.balls,
                overs: player.overs,
            })),
            ...secondTeamStats.map((player: PlayerStats) => ({
                matchId,
                playerName: player.playerName,
                teamId: secondTeamId,
                teamName: secondTeam.teamName,
                runs: player.runs,
                wickets: player.wickets,
                balls: player.balls,
                overs: player.overs,
            })),
        ];

        const { count } = await prisma.matchStats.createMany({ data: matchStatsData });

        if (count === 0) {
            res.status(400).json({ error: 'Failed to create player stats' });
            return;
        }

        res.status(201).json(matchStatsData);
    } catch (err) {
        console.error('Error creating match and player stats:', err);
        res.status(500).json({ error: 'Failed to create match and player stats' });
    }
});

// Update match stats by matchId
router.put('/:matchId', async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const { firstTeamStats, firstTeamId, secondTeamStats, secondTeamId } = req.body;
    try {
        const firstTeam = await prisma.teams.findUnique({
            where: { teamId: firstTeamId },
            select: { teamName: true },
        });
        
        const secondTeam = await prisma.teams.findUnique({
            where: { teamId: secondTeamId },
            select: { teamName: true },
        });

        if (!firstTeam || !secondTeam) {        
            res.status(404).json({ error: 'One or both teams do not exist' });
            return;
        }

        const matchStatsData = [
            ...firstTeamStats.map((player: PlayerStats) => ({
                matchId,
                playerName: player.playerName,
                teamId: firstTeamId,
                teamName: firstTeam.teamName,
                runs: player.runs,
                wickets: player.wickets,
                balls: player.balls,
                overs: player.overs,
            })),
            ...secondTeamStats.map((player: PlayerStats) => ({
                matchId,
                playerName: player.playerName,
                teamId: secondTeamId,
                teamName: secondTeam.teamName,
                runs: player.runs,
                wickets: player.wickets,
                balls: player.balls,
                overs: player.overs,
            })),
        ];

        const { count } = await prisma.matchStats.updateMany({ where: { matchId: Number(matchId) }, data: matchStatsData });

        if (count === 0) {
            res.status(400).json({ error: 'Failed to update player stats' });
            return;
        }

        res.status(200).json(matchStatsData);
    } catch (err) {
        console.error('Error updating match stats by matchId:', err);
        res.status(500).json({ error: 'Failed to update match stats by matchId' });
    }
});

// Delete match stats by matchId
router.delete('/:matchId', async (req: Request, res: Response) => {
    const { matchId } = req.params;
    try {
        const matchStats = await prisma.matchStats.deleteMany({ where: { matchId: Number(matchId) } });
        res.status(200).json({ message: 'Match and player stats deleted successfully', data: matchStats });
    } catch (err) {
        console.error('Error deleting match stats by matchId:', err);
        res.status(500).json({ error: 'Failed to delete match stats by matchId' });
    }
});

export default router;
