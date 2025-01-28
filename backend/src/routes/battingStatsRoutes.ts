import prisma from '../../prisma';
import express, { Request, Response } from 'express';
import { BattingStat } from '../types/battingStatsRoute';
import { io } from '../index';

const router = express.Router();

// Get all batting stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const battingStats = await prisma.battingStats.findMany({});
        res.json(battingStats);
        io.emit("teamAUpdate", {
            runs: battingStats.map(stat => stat.runs),
            overs: battingStats.map(stat => stat.balls),
            dismissedBatters: battingStats.map(stat => stat.dismissal),
            scorecardId: battingStats.map(stat => stat.scorecardId)
          });
          io.emit("teamBUpdate", {
            runs: battingStats.map(stat => stat.runs),
            overs: battingStats.map(stat => stat.balls),
            dismissedBatters: battingStats.map(stat => stat.dismissal),
            scorecardId: battingStats.map(stat => stat.scorecardId)
          });
          io.emit("dismissedBatter",{
            dismissedBatters: battingStats.map(stat => stat.dismissal),
          })

          io.emit('allBattingStats',{
            battingStats
          })
          
          io.emit('allDismissedStats',{
            battingStats
          })
          io.emit('allAddedStats',{
            battingStats
          })
    } catch (error) {
        res.status(500).json({ error: 'Error fetching batting stats' });
    }
    
      
});

// Post a new batting stat
router.post('/', async (req: Request, res: Response) => {
    const battingStats: BattingStat[] = req.body;

    if (!Array.isArray(battingStats)) {
        res.status(400).json({ error: 'Request body should be an array of batting stats' });
        return;
    }

    try {
        const createdStats = [];
        for (const stat of battingStats) {
            const { scorecardId, playerId, teamId, runs, balls, fours, sixes, strikeRate, dismissal } = stat;

            if (!scorecardId || !playerId == undefined || !teamId == undefined || !runs == undefined || !balls == undefined || !fours == undefined || !sixes == undefined || !strikeRate == undefined || !dismissal) {
                res.status(400).json({ error: 'Missing required fields in one or more batting stats' });
                return;
            }

            const player = await prisma.teamPlayer.findUnique({
                where: {
                    teamId_playerId: {
                        teamId,
                        playerId
                    }
                    
                },
            });

            const team = await prisma.teams.findUnique({
                where: {
                    teamId: teamId,
                },
            });

            if (!player || !team) {
                res.status(404).json({ error: 'Player or Team not found' });
                return;
            }

            const newBattingStat = await prisma.battingStats.create({
                data: {
                    scorecardId,
                    playerName: player.playerName,
                    teamName: team.teamName,
                    playerId,
                    runs,
                    balls,
                    fours,
                    sixes,
                    strikeRate,
                    dismissal,
                },
            });

            createdStats.push(newBattingStat);
        }

        res.status(201).json(createdStats);  // Respond with all the created stats
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding batting stats' });
    }
});

// Update a batting stat
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { scorecardId, playerId, teamId, runs, balls, fours, sixes, strikeRate, dismissal }: BattingStat = req.body;

    if (!scorecardId==undefined || !playerId==undefined || !teamId==undefined || !runs==undefined || !balls==undefined || !fours==undefined || !sixes==undefined || !strikeRate==undefined || !dismissal==undefined) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
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

        const updatedBattingStat = await prisma.battingStats.update({
            where: { battingStatsId: parseInt(id) },
            data: {
                scorecardId,
                playerName: player.playerName,
                teamName: team.teamName,
                runs,
                balls,
                fours,
                sixes,
                strikeRate,
                dismissal,
            },
        });

        io.emit('updatedBattingStat', updatedBattingStat);
        res.json(updatedBattingStat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating batting stats' });
    }
});

// Delete a batting stat
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedBattingStat = await prisma.battingStats.delete({
            where: { battingStatsId: parseInt(id) },
        });

        // io.emit('deletedBattingStat', deletedBattingStat);
        res.status(200).json({ message: "Batting stat deleted successfully", deletedBattingStat });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting batting stats' });
    }
});

export default router;