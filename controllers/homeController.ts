import asyncHandler from 'express-async-handler';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFilePath = path.join(__dirname, '..', 'src', 'views');

export const signupPage = asyncHandler(async (req, res, next) => {
    res.status(200);
    res.sendFile(path.join(htmlFilePath, 'signup.html'));
});

export const loginPage = asyncHandler(async (req, res, next) => {
    res.status(200);
    res.sendFile(path.join(htmlFilePath, 'login.html'));
});