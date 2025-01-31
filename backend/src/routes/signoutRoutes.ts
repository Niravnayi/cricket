import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Sign out successful' });
    }
    catch (error) {
        console.log(error)
    }
});

export default router;

