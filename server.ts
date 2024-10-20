import express, { Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect('mongodb://localhost:27017');

const PORT = process.env.PORT || 4500;

const filepath = path.join(__dirname, 'src');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
    res.status(200);
    res.sendFile(path.join(filepath, 'index.html'));
})