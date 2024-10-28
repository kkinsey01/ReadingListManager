import express, { NextFunction, Request, Response } from 'express';
import Jwt , {JwtPayload} from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}


const SECRET_KEY = '42';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).redirect('/home/login');
        return;
    }

    Jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err)  {
            res.status(403).redirect('/home/login');
            return;
        }

        const decodedUser = user as CustomJwtPayload;
        req.user = { userId: decodedUser.userId};
        next();
    })
}

export {SECRET_KEY, authenticateToken};