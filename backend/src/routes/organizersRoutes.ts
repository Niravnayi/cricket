import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'
import bcrypt from 'bcrypt';

interface Organizer {
    organizerName: string;
    organizerEmail: string;
    organizerPassword: string;
}

const router = express.Router();

// Get all organizers
router.get('/', async (req: Request, res: Response) => {
    try {
        const organizers = await prisma.organizers.findMany();
        res.json(organizers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create a new organizer
router.post('/', async (req: Request, res: Response) => {
    const { organizerName, organizerEmail, organizerPassword }: Organizer = req.body

    if(!organizerName || !organizerEmail || !organizerPassword) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(organizerPassword, 10);
        const organizer = await prisma.organizers.create({
            data: {
                 organizerName,
                 organizerEmail,
                 organizerPassword: hashedPassword
            }
        });
        res.status(201).json(organizer);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

//Update an organizer
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { organizerName, organizerEmail, organizerPassword }: Organizer = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid organizer ID' });
        return;
    }

    if(!organizerName || !organizerEmail || !organizerPassword) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(organizerPassword, 10);
        const updatedOrganizer = await prisma.organizers.update({
            where: {
                organizerId: Number(id),
            },
            data: {
                organizerName,
                organizerEmail,
                organizerPassword: hashedPassword,
            },
        });
        res.status(200).json(updatedOrganizer);
    } catch (err) {
        console.error('Error updating organizer:', err);
        res.status(500).json({ error: 'Failed to update organizer' });
    }
});

// Delete an organizer
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Invalid organizer ID' });
        return;
    }

    try {
        const deletedOrganizer = await prisma.organizers.delete({
            where: {
                organizerId: Number(id),
            },
        });
        res.status(200).json(deletedOrganizer);
    } catch (err) {
        console.error('Error deleting organizer:', err);
        res.status(500).json({ error: 'Failed to delete organizer' });
    }
});

// Get all tournaments for a specific organizer
router.get('/tournaments/:organizerId', async (req: Request, res: Response) => {
    const { organizerId } = req.params;

    if (isNaN(Number(organizerId))) {
        res.status(400).json({ error: 'Invalid organizer ID' });
        return;
    }

    try {
        const tournaments = await prisma.tournaments.findMany({
            where: {
                organizerId: Number(organizerId), 
            },
        });

        if (tournaments.length === 0) {
            res.status(404).json({ message: 'No tournaments found for this organizer' });
            return; 
        }

        res.status(200).json(tournaments);
    } catch (err) {
        console.error('Error fetching tournaments:', err);

        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});

export default router;
