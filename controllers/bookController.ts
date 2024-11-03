import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { apiKey } from '../server.js';
import { BookData, BookAPI } from '../src/models/book.js';
import { Schema } from 'mongoose';

const apiUrl = "https://www.googleapis.com/books/v1/volumes";

export const addBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
                userID: req.user?.userId as any
            }
            result.push(newBook);            
        })
    })
    .catch(error => {
        console.log(error);
    });
})