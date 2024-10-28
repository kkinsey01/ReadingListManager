import express from 'express';
import { signupForNewAccount, loginForExistingAccount } from '../controllers/userController.js';
import { authenticateToken } from '../src/js/authentication.js';

const userRoutes = express.Router();

userRoutes.post('/newUser', signupForNewAccount); // code for route is setup in userController
userRoutes.post('/login', loginForExistingAccount);

export { userRoutes };