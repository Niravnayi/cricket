import express, { Request, Response } from 'express';
import prisma from '../../prisma';
import { Extras } from '../types/extrasRoute'
// import { io } from '../index';

const router = express.Router();

// Get all extras
router.get('/', async (req: Request, res: Response) => {
    try {
        const extras = await prisma.extras.findMany();
        res.status(200).json(extras);
    } catch (error) {
        console.error('Error fetching extras:', error);
        res.status(500).json({ error: 'Failed to fetch extras' });
    }
});

// Get extras by scorecardId
router.get('/scorecard/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const extras = await prisma.extras.findMany({
            where: { scorecardId: Number(id) },
        });

        if (extras.length === 0) {
            res.status(404).json({ error: 'No extras found for the specified scorecardId' });
        } else {
            res.status(200).json(extras);
        }
    } catch (error) {
        console.error('Error fetching extras by scorecardId:', error);
        res.status(500).json({ error: 'Failed to fetch extras' });
    }
});


// Create new extras
router.post('/', async (req: Request, res: Response) => {
    const { scorecardId, teamId, byes, legByes, wides, noBalls, totalExtras }: Extras = req.body;
    console.log(scorecardId, teamId, byes, legByes, wides, noBalls, totalExtras)
    if (!scorecardId || !teamId || byes ==undefined || legByes==undefined || wides==undefined || noBalls ==undefined || totalExtras ==undefined ) {
        res.status(400).json({ error: 'Missing required fields' });
        return 
    }

    try {
        const team = await prisma.teams.findUnique({
            where: {
                teamId: teamId,
            },
        })

        if (!team) {
            res.status(404).json({ error: 'Player or Team not found' });
            return;
        }

        const extras = await prisma.extras.create({
            data: {
                scorecardId,
                teamName: team.teamName,
                byes,
                legByes,
                wides,
                noBalls,
                totalExtras,
            },
        });

        // io.emit('extras', extras);
        res.status(201).json(extras);
    } catch (error) {
        console.error('Error creating extras:', error);
        res.status(500).json({ error: 'Failed to create extras' });
    }
});

// Update extras
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { scorecardId, teamId, byes, legByes, wides, noBalls, totalExtras }: Extras = req.body;
    console.log(scorecardId, teamId, byes, legByes, wides, noBalls, totalExtras)
    try {
        const team = await prisma.teams.findUnique({
            where: {
                teamId: teamId,
            },
        })

        if (!team) {
            res.status(404).json({ error: 'Player or Team not found' });
            return;
        }

        const extras = await prisma.extras.update({
            where: { extrasId: Number(id) },
            data: {
                scorecardId,
                teamName: team.teamName,
                byes,
                legByes,
                wides,
                noBalls,
                totalExtras,
            },
        });

        // io.emit('extras', extras);
        res.status(200).json(extras);
    } catch (error) {
        console.error('Error updating extras:', error);
        res.status(500).json({ error: 'Failed to update extras' });
    }
});

// Delete extras
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedExtras = await prisma.extras.delete({
            where: { extrasId: Number(id) },
        });

        // io.emit('extras', deletedExtras);
        res.status(200).json({message: 'Extras deleted successfully', deletedExtras});
    } catch (error) {
        console.error('Error deleting extras:', error);
        res.status(500).json({ error: 'Failed to delete extras' });
    }
});

export default router;
