import {Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFilePath = path.join(__dirname, '..', 'src', 'views'); // go up one directory from controllers to get to src/views

export const signupPage = asyncHandler(async (req: Request, res: Response, next : NextFunction) => { // set up the function code that will be hit when the defined route in homeRoutes is hit
    res.status(200);
    res.sendFile(path.join(htmlFilePath, 'signup.html'));
});

export const loginPage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.sendFile(path.join(htmlFilePath, 'login.html'));
});

export const homePage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.sendFile(path.join(htmlFilePath, 'index.html'));
})