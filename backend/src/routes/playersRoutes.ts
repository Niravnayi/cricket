import express, { Request, Response } from 'express';
import prisma from '../../prisma/index';
import { io } from '../index';

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await prisma.players.findMany();
    res.status(200).json(players);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Get a player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const player = await prisma.players.findUnique({
      where: { playerId: parseInt(id) },
    });

    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    res.status(200).json(player);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Create a new player
router.post('/', async (req, res) => {
  try {
    const { playerName, playerAge, isCaptain, playerRole } = req.body;

    const newPlayer = await prisma.players.create({
      data: {
        playerName,
        playerAge,
        isCaptain,
        playerRole,
      },
    });

    io.emit('playerCreated', newPlayer);
    res.status(201).json(newPlayer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Update a player by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { playerName, playerAge, isCaptain, playerRole } = req.body;

    const updatedPlayer = await prisma.players.update({
      where: { playerId: parseInt(id) },
      data: {
        playerName,
        playerAge,
        isCaptain,
        playerRole,
      },
    });

    io.emit('playerUpdated', updatedPlayer);
    res.status(200).json(updatedPlayer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Delete a player by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlayer = await prisma.players.delete({
      where: { playerId: parseInt(id) },
    });

    io.emit('playerDeleted', deletedPlayer);
    res.status(200).json({message: "Player deleted successfully", deletedPlayer});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

export default router;
