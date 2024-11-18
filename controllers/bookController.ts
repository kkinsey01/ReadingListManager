import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { apiKey } from '../server.js';
import { BookModel, BookData, BookAPI } from '../src/models/book.js';
import { Schema } from 'mongoose';
import { UsersModel } from '../src/models/users.js';

const apiUrl = "https://www.googleapis.com/books/v1/volumes";

export const searchBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { author, title, genre } = req.body;            

    let apiQuery = `${apiUrl}?q=`;    

    if (!author && !title && !genre) {
        res.status(400).json({ message: 'No valid input'});
    }

    if (author) {        
        apiQuery += `inauthor:${author}+`;
    }

    if (title) {        
        apiQuery += `intitle:${title}+`;
    }

    if (genre) {        
        apiQuery += `subject:${genre}`;
    }    

    if (apiQuery.charAt(apiQuery.length - 1) === '+')
        apiQuery = apiQuery.slice(0, -1);

    apiQuery += `&key=${apiKey}`;

    apiQuery = apiQuery.replace(/ /g, '+');

    console.log(apiQuery);

    fetch(apiQuery, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) 
            return response.json();
        else 
            throw new Error('Bad Book API response');
    })
    .then(data => {
        const items = data.items as unknown[];    
        let result: BookData[] = [];
        items.forEach((item) => {
            const typedItem = item as BookAPI;
            let bookInfo = typedItem.volumeInfo;
            let newBook: BookData = {
                title: bookInfo.title as string,
                authors: bookInfo.authors as string[],
                categories: bookInfo.categories as string[],
                pagesRead: 0,
                totalPages: bookInfo.pageCount as number,
                averageRating: bookInfo.averageRating as number,
                numberOfRatings: bookInfo.ratingsCount as number,
                status: 'Want to read',
                userID: req.user?.userId as any
            }
            result.push(newBook);            
        })
        return res.status(200).json({ Books: result });        
    })
    .catch(error => {
        console.log(error);
        return res.status(400).json({ message: "Error recieving book data"});
    });
})

export const addBookToUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, authors, categories, pagesRead, totalPages} = req.body;
    
    const existingBookForUser = await BookModel.findOne({
        title, authors, totalPages, userID: req.user?.userId
    });
    if (existingBookForUser) {
         res.status(400).json({ message: 'User already registered book'});
         return;
    }

    const newBook = new BookModel({
        title: title,
        authors: authors,
        categories: categories,
        pagesRead: 0,
        totalPages: totalPages,
        status: 'Want to read',
        userID: req.user?.userId
    });

    console.log(newBook);

    newBook.save();

    res.status(200).json({ message: "Successfully added book to user profile", book: newBook})
});

export const retrieveUsersBooks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const books = await BookModel.find({
        userID: req.user?.userId
    });

    res.status(200).json({ books: books});
})

export const updateUserBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, status } = req.body;
    
    const existingBookForUser = await BookModel.findOne({
        title, userID: req.user?.userId
    });
    if (!existingBookForUser) {
        res.status(400).json({ message: 'Could not find book to update for User'});
        return;
    }    

    const updatedBook = await BookModel.findByIdAndUpdate(
        existingBookForUser.id,
        { status },
        { new: true}
    );    

    if (updatedBook) {
        res.status(200).json({ message: 'Update successful' });        
    }
    else {
        res.status(400).json({ message: 'Update unsuccessful' });
    }
})

export const updatePageCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, pageCount} = req.body;    

    const existingBookForUser = await BookModel.findOne({
        title, userID: req.user?.userId
    });    

    if (!existingBookForUser) {
        res.status(400).json({ message: 'Could not find book to update for User' });
        return;
    }    

    let pageCountAsNum: number = parseInt(pageCount);

    if (pageCountAsNum === existingBookForUser.totalPages) {        
        const updatedBook = await BookModel.findByIdAndUpdate(
            existingBookForUser.id,
            { pagesRead: pageCount, status: 'Finished'},
            {new: true}
        );
        if (updatedBook) {
            res.status(200).json({ message: 'Update successful' });
        }
        else {
            res.status(400).json({ message: 'Update unsuccessful' });
        }
    }
    else {        
        const updatedBook = await BookModel.findByIdAndUpdate(
            existingBookForUser.id,
            { pagesRead: pageCount },
            { new: true }
        );
        if (updatedBook) {
            res.status(200).json({ message: 'Update successful' });
        }
        else {
            res.status(400).json({ message: 'Update unsuccessful' });
        }
    }       
})

export const deleteBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    if (!title || !req.user?.userId) {
        res.status(400).json({ message: 'Title and userID are required'});
        return;
    }

    const result = await BookModel.deleteOne( {title, userID: req.user?.userId});

    if (result.deletedCount === 0) {
        res.status(400).json({ message: 'Book not found' });
        return;    
    }

    res.status(200).json({ message: 'Book deleted successfully' });
})