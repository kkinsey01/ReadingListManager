import express from 'express';
import { signupForNewAccount } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.post('/newUser', signupForNewAccount); // code for route is setup in userController

export { userRoutes };