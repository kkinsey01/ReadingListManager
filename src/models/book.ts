import { Schema, model, Document } from 'mongoose';

interface BookData {
    title: string,
    authors: string[],
    categories: string[],
    pagesRead?: Number,
    totalPages?: Number,
    averageRating?: Number,
    numberOfRatings?: Number,
    imageLinks: ImageLinks,
    review?: string,
    status: String,    
    userID: Schema.Types.ObjectId
}

interface BookAPI {
    kind: string,
    id: string,
    etag: string,
    selfLink: string,
    volumeInfo: VolumeInfo,
    saleInfo: object[],
    accessInfo: object[],
    searchInfo: object[]
}

interface VolumeInfo {
    title: string,
    authors: string[],
    categories: string[],    
    pageCount: number,
    averageRating: number,
    ratingsCount: number,
    imageLinks: ImageLinks
}

interface ImageLinks {
    smallThumbnail: string,
    thumbnail: string
}

interface Book extends Document {
    title: string,
    authors: string[],
    categories: string[],
    pagesRead?: Number,
    totalPages?: Number,
    averageRating?: Number,
    numberOfRatings?: Number,
    review: string,
    status: String,
    thumbnail: String,
    userID: Schema.Types.ObjectId
}

const bookSchema = new Schema<Book>({
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    categories: { type: [String], required: true },
    pagesRead: { type: Number, required: true},
    totalPages: { type: Number, required: true},
    status: { type: String, required: true},
    thumbnail: { type: String},
    review: { type: String, required: false},
    userID: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
})

const BookModel = model<Book>('Book', bookSchema, 'Books');

export { BookModel, BookData, BookAPI, ImageLinks, Book };