import { Schema, model, Document } from 'mongoose';

interface Book extends Document {
    title: string,
    author: string,
    category: string,
    userID: Schema.Types.ObjectId
}

const bookSchema = new Schema<Book>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
})

const BookModel = model<Book>('Book', bookSchema);

export { BookModel };