import express, { Request, Response } from 'express';
import prisma from '../../prisma';

interface Match {
    tournamentId: number;
    firstTeamId: number;
    secondTeamId: number;
}

const router = express.Router();

//Get all matches
router.get('/', async (req: Request, res: Response) => {
    try {
        const matches = await prisma.matches.findMany();
        res.json(matches);
    } catch (err) {
        console.error('Error fetching matches:', err);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
})

// Create a new match
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { tournamentId, firstTeamId, secondTeamId }: Match = req.body;
    
    try {
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId: tournamentId },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament does not exist' });
            return;
        }

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
        const newMatch = await prisma.matches.create({
            data: {
                tournamentName: tournamentExists.tournamentName,
                tournamentId: tournamentExists.tournamentId,
                firstTeamId: firstTeamId,
                firstTeamName: firstTeam.teamName,
                secondTeamId: secondTeamId,
                secondTeamName: secondTeam.teamName,
            },
        });
     
        res.status(201).json({
            message: 'Match and player stats added successfully',
            match: newMatch,
        });
    } catch (err) {
        console.error('Error creating match and player stats:', err);
        res.status(500).json({ error: 'Failed to create match and player stats' });
    }
});

//Update a match
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tournamentId, firstTeamId, secondTeamId }: Match = req.body;
    try {
        const match = await prisma.matches.update({
            where: { matchId: Number(id) },
            data: {
                tournamentId: tournamentId,
                firstTeamId: firstTeamId,
                secondTeamId: secondTeamId,
            },    
        });
        res.status(200).json(match);
    } catch (err) {
        console.error('Error updating match:', err);
        res.status(500).json({ error: 'Failed to update match' });
    }
});

// Delete a match
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const match = await prisma.matches.delete({
            where: { matchId: Number(id) },
        });
        res.status(200).json(match);
    } catch (err) {
        console.error('Error deleting match:', err);
        res.status(500).json({ error: 'Failed to delete match' });
    }
});

// Get all matches for a specific tournament
router.get('/tournaments/:tournamentId', async (req: Request, res: Response) => {
    const { tournamentId } = req.params;

    if (isNaN(Number(tournamentId))) {
        res.status(400).json({ error: 'Invalid tournament ID' });
        return;
    }

    try {   
        const matches = await prisma.matches.findMany({
            where: { tournamentId: Number(tournamentId) },
        });
        res.json(matches);
    } catch (err) {
        console.error('Error fetching matches for tournament:', err);
        res.status(500).json({ error: 'Failed to fetch matches for tournament' });
    }
});

export default router;