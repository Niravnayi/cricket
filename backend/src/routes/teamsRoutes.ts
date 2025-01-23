import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'
// import { io } from '../index';

interface Team {
    teamName: string;
    tournamentId: number;
    playerIds: number[];
}

const router = express.Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
    try {
        const teams = await prisma.teams.findMany({
            include: {
                players: { include: { player: true } },
                tournamentTeams: { include: { tournament: true } }, 
            },
        });
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});


// Create a new team
router.post('/', async (req: Request, res: Response) => {
    const { teamName, tournamentId, playerIds }: Team = req.body;

    if (!teamName || !tournamentId || !Array.isArray(playerIds) || playerIds.length === 0) {
        res.status(400).json({ error: 'Missing required fields or invalid playerIds' });
        return;
    }

    try {
        //check whether team name already exists
        const existingTeam = await prisma.teams.findFirst({
            where: {
                teamName,
            },
        })

        if (existingTeam) {
            res.status(400).json({ error: 'Team name already exists' });
            return;
        }

        // Fetch existing players from the database
        const existingPlayers = await prisma.players.findMany({
            where: {
                playerId: { in: playerIds },
            },
        });

        if (existingPlayers.length !== playerIds.length) {
            const missingPlayerIds = playerIds.filter(
                (id) => !existingPlayers.some((player) => player.playerId === id)
            );
            res.status(400).json({
                error: `Some players were not found: ${missingPlayerIds.join(', ')}`,
            });
            return;
        }

        // Create the team
        const team = await prisma.teams.create({
            data: {
                teamName,
                players: {
                    create: existingPlayers.map((player) => ({
                        playerId: player.playerId,
                        playerName: player.playerName
                    })),
                },
            },
        });

        // Create the tournament-team relationship
        await prisma.tournamentTeams.create({
            data: {
                tournamentId,
                teamId: team.teamId,
            },
        });

        // io.emit('teamCreated', team);
        res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
});


// Update a team
router.put('/:teamId', async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { teamName, tournamentId, playerIds }: Team = req.body;

    if (!teamName && !tournamentId && !Array.isArray(playerIds)) {
        res.status(400).json({ error: 'No fields to update' });
        return;
    }

    try {
        // Find the team by ID
        const existingTeam = await prisma.teams.findUnique({
            where: {
                teamId: parseInt(teamId),
            },
        });

        if (!existingTeam) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }

        // Check if the new team name already exists (if the team name is being updated)
        if (teamName && teamName !== existingTeam.teamName) {
            const teamWithNewName = await prisma.teams.findFirst({
                where: {
                    teamName,
                },
            });
            if (teamWithNewName) {
                res.status(400).json({ error: 'Team name already exists' });
                return;
            }
        }

        // Fetch existing players from the database
        if (playerIds && Array.isArray(playerIds)) {
            const existingPlayers = await prisma.players.findMany({
                where: {
                    playerId: { in: playerIds },
                },
            });

            if (existingPlayers.length !== playerIds.length) {
                const missingPlayerIds = playerIds.filter(
                    (id) => !existingPlayers.some((player) => player.playerId === id)
                );
                res.status(400).json({
                    error: `Some players were not found: ${missingPlayerIds.join(', ')}`,
                });
                return;
            }

            // Update the players in the team (delete existing players and add new ones)
            await prisma.teamPlayer.deleteMany({
                where: {
                    teamId: parseInt(teamId),
                },
            });

            // Add the new players
            await prisma.teamPlayer.createMany({
                data: existingPlayers.map((player) => ({
                    teamId: parseInt(teamId),
                    playerId: player.playerId,
                    playerName: player.playerName, // Store player name
                })),
            });
        }

        // Update the team name and tournament if provided
        const updatedTeam = await prisma.teams.update({
            where: { teamId: parseInt(teamId) },
            data: {
                teamName: teamName || existingTeam.teamName,
            },
        });

        // Update the tournament-team relationship if a tournamentId is provided
        if (tournamentId) {
            // Check if the tournament exists
            const tournament = await prisma.tournaments.findUnique({
                where: { tournamentId },
            });

            if (!tournament) {
                res.status(400).json({ error: 'Tournament not found' });
                return;
            }

            // Update the tournament-team relationship
            await prisma.tournamentTeams.upsert({
                where: {
                    tournamentId_teamId: {
                        tournamentId,
                        teamId: parseInt(teamId),
                    },
                },
                update: {
                    tournamentId,
                    teamId: parseInt(teamId),
                },
                create: {
                    tournamentId,
                    teamId: parseInt(teamId),
                },
            });
        }

        // io.emit('teamUpdated', updatedTeam);
        res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Failed to update team' });
    }
});


// Delete a team
router.delete('/:teamId', async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        // Check if the team exists
        const existingTeam = await prisma.teams.findUnique({
            where: {
                teamId: parseInt(teamId),
            },
        });

        if (!existingTeam) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }

        // Delete the team's players from the teamPlayer table
        await prisma.teamPlayer.deleteMany({
            where: {
                teamId: parseInt(teamId),
            },
        });

        // Delete the team's tournament-team relationship from the tournamentTeam table
        await prisma.tournamentTeams.deleteMany({
            where: {
                teamId: parseInt(teamId),
            },
        });

        // Delete the team itself
        const deletedTeam = await prisma.teams.delete({
            where: {
                teamId: parseInt(teamId),
            },
        });

        // io.emit('teamDeleted', deletedTeam);
        res.status(200).json({ message: 'Team deleted successfully', deletedTeam });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Failed to delete team' });
    }
});

// Add a player to a team
// router.post('/:teamId/players', async (req: Request, res: Response) => {
//     const { teamId } = req.params;
//     const { playerId, playerName } = req.body;

//     try {
//         const teamPlayer = await prisma.teamPlayer.create({
//             data: { teamId: parseInt(teamId), playerId, playerName },
//         });

//         res.status(201).json(teamPlayer);
//     } catch (error) {
//         console.error('Error adding player to team:', error);
//         res.status(500).json({ error: 'Failed to add player to team' });
//     }
// });

// Remove a player from a team
// router.delete('/:teamId/players/:playerId', async (req: Request, res: Response) => {
//     const { teamId, playerId } = req.params;

//     try {
//         await prisma.teamPlayer.delete({
//             where: {
//                 teamId_playerId: {
//                     teamId: parseInt(teamId),
//                     playerId: parseInt(playerId),
//                 },
//             },
//         });

//         res.status(204).send();
//     } catch (error) {
//         console.error('Error removing player from team:', error);
//         res.status(500).json({ error: 'Failed to remove player from team' });
//     }
// });

export default router;
