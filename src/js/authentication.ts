import express, { NextFunction, Request, Response } from 'express';
import Jwt , {JwtPayload, VerifyErrors} from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}


const SECRET_KEY = '42';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    if (!token) {
        console.log('No token');
        res.status(401).redirect('/home/login');
        return;
    }

    Jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
        if (err)  {
            console.log('Unable to verify JWT');
            res.status(403).redirect('/home/login');
            return;
        }

        const decodedUser = user as CustomJwtPayload;
        req.user = { userId: decodedUser.userId};
        next();
    })
}

export {SECRET_KEY, authenticateToken};