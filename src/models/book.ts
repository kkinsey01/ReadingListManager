import { Schema, model, Document } from 'mongoose';

interface Book extends Document {
    title: string,
    author: string,
    category: string,
    userID: number
}

const bookSchema = new Schema<Book>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    userID: { type: Number, required: true }
})

const BookModel = model<Book>('Book', bookSchema);

export { BookModel };