import express, { Request, Response } from 'express';
import path from 'path';

const app = express();

const PORT = process.env.PORT || 4500;

const filepath = path.join(__dirname, 'public');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
    res.status(200);
    res.sendFile(path.join(filepath, 'index.html'));
})