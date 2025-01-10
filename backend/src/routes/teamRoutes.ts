import express, { Request, Response } from 'express';
import prisma from '../../prisma/index'
const router = express.Router();
router.post('/', async (req: Request, res: Response) => {
    const { name, tournamentId, players } = req.body;
    try {
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { tournamentId: tournamentId },
        });
        console.log(tournamentExists)
        const team = await prisma.teams.create({
            data: {
                tournamentName: tournamentExists ? tournamentExists.tournamentName : 'Unknown Tournament',
                teamName: name,
                playersName: players,
                tournament: {
                    connect: {
                        tournamentId: tournamentId,
                    },
                },
            },
        });

        res.status(201).json({ message: 'Team added successfully' });
    } catch (err) {
        console.error('Error creating team:', err);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

router.get('/',async (req:Request,res:Response)=>{
    const {id} = req.body
    try{
        const teamsData = await prisma.teams.findUnique({
            where:{
                id:id
            }
        })
        res.status(201).json({ teamsData })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:'cannot fetch team'})
    }
})

export default router;
