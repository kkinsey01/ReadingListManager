import express, { Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser, { BodyParser } from 'body-parser';
import { fileURLToPath } from 'url';
import { homeRoutes } from './routes/homeRoutes.js';

// Get the filename and dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017');

// Serve static files from the dist/public directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

const PORT = process.env.PORT || 4500;

// Path to the dist/views directory
const htmlFilePath = path.join(__dirname, 'src', 'views');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home/login');
})

app.use('/home', homeRoutes);

// app.get('/', (req: Request, res: Response) => {
//     res.status(200);
//     res.sendFile(path.join(htmlFilePath, 'login.html'));
// });

// app.get('/home/loginPage', (req: Request, res: Response) => {
//     res.status(200);
//     res.sendFile(path.join(htmlFilePath, 'login.html'));
// });

// app.get('/home/signupPage', (req: Request, res: Response) => {
//     res.status(200);
//     res.sendFile(path.join(htmlFilePath, 'signup.html'));
// });
