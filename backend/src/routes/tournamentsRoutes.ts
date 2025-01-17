import express, { Request, Response } from 'express';
import prisma from '../../prisma/index';

interface Tournament {
    tournamentName: string;
    organizerId: number;
    teamIds: number[];
}

const router = express.Router();

// Get all tournaments
router.get('/', async (req: Request, res: Response) => {
    try {
        const tournaments = await prisma.tournaments.findMany({
            include: {
                teams: {
                    include: { team: true },
                },
            },
        });
        res.status(200).json(tournaments);
    } catch (err) {
        console.error('Error fetching tournaments:', err);
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});

// Get a specific tournament
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid tournament ID' });
        return;
    }

    try {
        const tournament = await prisma.tournaments.findUnique({
            where: { tournamentId: Number(id) },
            include: {
                teams: {
                    include: { team: true },
                },
            },
        });

        if (!tournament) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }

        res.status(200).json(tournament);
    } catch (err) {
        console.error('Error fetching tournament:', err);
        res.status(500).json({ error: 'Failed to fetch tournament' });
    }
});

// Create a new tournament
router.post('/', async (req: Request, res: Response) => {
    const { tournamentName, organizerId, teamIds }: Tournament = req.body;

    if (!tournamentName || !organizerId) {
        res.status(400).json({ error: 'Missing required fields: tournamentName or organizerId' });
        return;
    }

    try {
        // Check if organizer exists
        const organizerExists = await prisma.organizers.findUnique({
            where: { organizerId },
        });

        if (!organizerExists) {
            res.status(404).json({ error: 'Organizer not found' });
            return;
        }

        // Create tournament
        const tournament = await prisma.tournaments.create({
            data: {
                tournamentName,
                organizer: { connect: { organizerId } },
                // If teamIds are provided, create relationships with teams
                teams: teamIds ? {
                    create: teamIds.map((teamId) => ({ teamId }))
                } : undefined,
            },
            include: {
                teams: true,
            },
        });

        res.status(201).json(tournament);
    } catch (err) {
        console.error('Error creating tournament:', err);
        res.status(500).json({ error: 'Failed to create tournament' });
    }
});

// Update a tournament
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tournamentName, organizerId, teamIds }: Tournament = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid or missing tournament ID' });
        return;
    }

    try {
        const tournamentId = Number(id);

        // Check if tournament exists
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }

        // Check if organizer exists
        if (organizerId) {
            const organizerExists = await prisma.organizers.findUnique({
                where: { organizerId },
            });

            if (!organizerExists) {
                res.status(404).json({ error: 'Organizer not found' });
                return;
            }
        }

        // Update tournament
        const updatedTournament = await prisma.tournaments.update({
            where: { tournamentId },
            data: {
                tournamentName,
                organizer: organizerId ? { connect: { organizerId } } : undefined,
            },
        });

        // Update team associations if provided
        if (Array.isArray(teamIds)) {

            // Remove old associations
            await prisma.tournamentTeams.deleteMany({
                where: { tournamentId },
            });

            // Add new associations
            await prisma.tournamentTeams.createMany({
                data: teamIds.map((teamId) => ({ tournamentId, teamId })),
            });
        }

        res.status(200).json({ message: 'Tournament updated successfully', tournament: updatedTournament });
    } catch (err) {
        console.error('Error updating tournament:', err);
        res.status(500).json({ error: 'Failed to update tournament' });
    }
});

// Delete a tournament
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid tournament ID' });
        return;
    }

    try {
        const tournamentId = Number(id);

        // Check if tournament exists
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId },
        });

        if (!tournamentExists) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }

        // Delete tournament and its related data
        await prisma.tournaments.delete({
            where: { tournamentId },
        });

        res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (err) {
        console.error('Error deleting tournament:', err);
        res.status(500).json({ error: 'Failed to delete tournament' });
    }
});

// Remove a team from a tournament
router.delete('/:tournamentId/teams/:teamId', async (req: Request, res: Response) => {
    const { tournamentId, teamId } = req.params;

    if (isNaN(Number(tournamentId)) || isNaN(Number(teamId))) {
        res.status(400).json({ error: 'Invalid tournament ID or team ID' });
        return;
    }

    try {
        // Check if the team is part of the tournament
        const tournamentTeam = await prisma.tournamentTeams.findUnique({
            where: {
                tournamentId_teamId: {
                    tournamentId: Number(tournamentId),
                    teamId: Number(teamId),
                },
            },
        });

        if (!tournamentTeam) {
            res.status(404).json({ error: 'Team not found in the specified tournament' });
            return;
        }

        // Remove the team from the tournament
        await prisma.tournamentTeams.delete({
            where: {
                tournamentId_teamId: {
                    tournamentId: Number(tournamentId),
                    teamId: Number(teamId),
                },
            },
        });

        res.status(200).json({ message: 'Team removed from the tournament successfully' });
    } catch (error) {
        console.error('Error removing team from tournament:', error);
        res.status(500).json({ error: 'Failed to remove team from tournament' });
    }
});

export default router;
