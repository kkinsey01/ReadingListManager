import express from 'express';
import { signupPage, loginPage, homePage } from '../controllers/homeController.js';
import { authenticateToken } from '../src/js/authentication.js';

const homeRoutes = express.Router();

homeRoutes.get('/signup', signupPage); // function code is set in homeController.ts. This just sets the http request type and the route
homeRoutes.get('/login', loginPage);
homeRoutes.get('/homepage', authenticateToken, homePage);

export { homeRoutes };