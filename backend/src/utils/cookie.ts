import { Response } from 'express';

export const setAuthCookies = (res: Response, token: string, id: string, role: string): void => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('userId', id, {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('userRole', role, {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });
};
