import express from 'express';
import { signupPage, loginPage } from '../controllers/homeController.js';

const homeRoutes = express.Router();

homeRoutes.get('/signup', signupPage); // function code is set in homeController.ts. This just sets the http request type and the route
homeRoutes.get('/login', loginPage);

export { homeRoutes };