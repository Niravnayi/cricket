import express, { Request, Response } from 'express';
import prisma from '../../prisma/index';
import { Player } from '../types/playersRoute';

const router = express.Router();

// Get all players
router.get('/', async (req: Request, res: Response) => {
  try {
    const players = await prisma.players.findMany();
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Create a new player
router.post('/', async (req: Request, res: Response) => {
  const { playerName, playerAge }: Player = req.body;

  if (!playerName || !playerAge) {
    res.status(400).json({ error: 'Missing required fields' });
    return 
  }

  try {
    const player = await prisma.players.create({
      data: { playerName, playerAge },
    });

    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// Update a player
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { playerName, playerAge }: Player = req.body;

  if (!playerName || !playerAge) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const updatedPlayer = await prisma.players.update({
      where: { playerId: parseInt(id) },
      data: { playerName, playerAge },
    });
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating player' });
  }
})

// Delete a player
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await prisma.players.delete({
      where: { playerId: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting player' });
  }
})
export default router;
