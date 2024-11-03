import express from 'express'
import { authenticateToken } from '../src/js/authentication.js';
import { addBook } from '../controllers/bookController.js';

const bookRoutes = express.Router();

bookRoutes.post('/addBook', authenticateToken, addBook);

export { bookRoutes };