import prisma from "../../prisma";
import express, { Request, Response } from 'express';
import { io } from '../index';

const router = express.Router();

router.get('/:matchId', async (req: Request, res: Response) => {
    const {matchId} = req.params;
    console.log(matchId)
    
    try {
        // Fetch match state for the given matchId
        const matchState = await prisma.matchState.findUnique({
            where: { matchId: Number(matchId) },
        });

        if (!matchState) {
            res.status(404).json({ error: 'Match state not found' });
            return
        }

        // Return the current batters and bowler
        res.json({
            batter1Id: matchState.currentBatter1Id,
            batter2Id: matchState.currentBatter2Id,
            bowlerId: matchState.currentBowlerId,
        });
        io.emit('matchStateFetched',{
            batter1Id: matchState.currentBatter1Id,
            batter2Id: matchState.currentBatter2Id,
            bowlerId: matchState.currentBowlerId,
        })
    } catch (error) {
        console.error('Error fetching match state:', error);
        res.status(500).json({ error: 'Failed to fetch match state' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { matchId, batter1Id, batter2Id, bowlerId } = req.body;
    
    if (!matchId || !batter1Id || !batter2Id || !bowlerId) {
        res.status(400).json({ error: 'All fields (matchId, batter1Id, batter2Id, bowlerId) are required' });
        return;
    }

    try {
        // Check if a match state already exists for the given matchId
        const existingMatchState = await prisma.matchState.findUnique({
            where: { matchId: Number(matchId) },
        });

        if (existingMatchState) {
            res.status(400).json({ error: 'Match state already exists for this matchId' });
            return;
        }

        // Create a new match state entry
        const newMatchState = await prisma.matchState.create({
            data: {
                matchId: Number(matchId),
                currentBatter1Id: batter1Id,
                currentBatter2Id: batter2Id,
                currentBowlerId: bowlerId,
            },
        });

        // Return the created match state
        // io.emit('matchStateCreated', newMatchState);
        res.status(201).json(newMatchState);
    } catch (error) {
        console.error('Error creating match state:', error);
        res.status(500).json({ error: 'Failed to create match state' });
    }
});

router.put('/:matchId', async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const { dismissedBatterId, newBatterId, newBowlerId } = req.body;

    try {
        // Check if the match state exists
        let matchState = await prisma.matchState.findUnique({
            where: { matchId: Number(matchId) },
        });

        // If match state doesn't exist, create a new state entry
        if (!matchState) {
            matchState = await prisma.matchState.create({
                data: { matchId: Number(matchId), currentBatter1Id: dismissedBatterId, currentBatter2Id: newBatterId, currentBowlerId: newBowlerId },
            });
            return  // Return the newly created match state
        }

        // Directly replace the batter IDs and the bowler
        const updatedMatchState = await prisma.matchState.update({
            where: { matchId: Number(matchId) },
            data: {
                currentBatter1Id: newBatterId,  // Replace batter 1
                currentBatter2Id: newBatterId,  // Replace batter 2 (assuming only one batter is replaced)
                currentBowlerId: newBowlerId,  // Replace the bowler
            },
        });

        // Return updated match state
        res.json(updatedMatchState);
    } catch (error) {
        console.error('Error updating match state:', error);
        res.status(500).json({ error: 'Failed to update match state' });
    }
});


router.delete('/:matchId', async (req: Request, res: Response) => {
    const { matchId } = req.params;

    try {
        const deletedMatchState = await prisma.matchState.delete({
            where: { matchId: Number(matchId) },
        });
        
        // io.emit('matchStateDeleted', deletedMatchState);
        res.status(200).json({message: "Match state deleted successfully", deletedMatchState});
    } catch (error) {    
        res.status(500).json({ error: 'Error deleting match state' });
    }
});


export default router

function typeOf(matchId: string): any {
    throw new Error("Function not implemented.");
}
