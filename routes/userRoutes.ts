import express from 'express';
import { signupForNewAccount, loginForExistingAccount, logout, retrieveProfile, updateReview } from '../controllers/userController.js';
import { authenticateToken } from '../src/js/authentication.js';

const userRoutes = express.Router();

userRoutes.post('/newUser', signupForNewAccount); // code for route is setup in userController
userRoutes.post('/login', loginForExistingAccount);
userRoutes.post('/logout', logout);
userRoutes.post('/profile', authenticateToken, retrieveProfile);
userRoutes.post('/updateReview', authenticateToken, updateReview);

export { userRoutes };