import express from 'express'
import { authenticateToken } from '../src/js/authentication.js';
import { addBookToUser, searchBook, retrieveUsersBooks, updateUserBook, updatePageCount } from '../controllers/bookController.js';

const bookRoutes = express.Router();

bookRoutes.post('/searchBook', authenticateToken, searchBook);
bookRoutes.post('/addBookToUser', authenticateToken, addBookToUser)
bookRoutes.get('/retrieve', authenticateToken, retrieveUsersBooks);
bookRoutes.post('/update', authenticateToken, updateUserBook);
bookRoutes.post('/updatePageCount', authenticateToken, updatePageCount);

export { bookRoutes };