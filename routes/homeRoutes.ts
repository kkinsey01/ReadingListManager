import express from 'express';
import { signupPage, loginPage } from '../controllers/homeController.js';

const homeRoutes = express.Router();

homeRoutes.get('/signup', signupPage);
homeRoutes.get('/login', loginPage);

export { homeRoutes };