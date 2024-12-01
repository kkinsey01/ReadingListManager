import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { UsersModel } from '../src/models/users.js'
import { BookModel } from '../src/models/book.js';
import Jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../src/js/authentication.js';
import bcrypt from 'bcrypt'
import { request } from 'http';
import { Profile } from '../src/models/profile.js';

export const signupForNewAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, userName, password, confirmPassword } = req.body;
    let validation: String = validateUserInfo(fullName, email, userName, password, confirmPassword);
    if (validation.length > 0) { // if it contains any sort of message
        res.status(400).json({ message: validation});
        return;
    }

    const exisitingEmail = await UsersModel.findOne({ email });
    if (exisitingEmail) {
        res.status(400).json({ message: "User already exists with email: " + email });
        return;
    }

    const exisitngUserName = await UsersModel.findOne({ userName });
    if (exisitngUserName) {
        res.status(400).json({ message: "User already exists with username: " + userName });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({ message: "Mismatched password"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UsersModel({
        name: fullName,
        email: email,
        userName: userName,
        password: hashedPassword
    }); // hash password 

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser});
})

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', '', {
        expires: new Date(0), 
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully'});
})

export const loginForExistingAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;    

    console.log('Username ', userName);
    console.log('Password ', password);
    if (!userName || !password) {
        res.status(400).json({ message: "Invalid username or password"});
        return;
    }

    // search for either username or passwords
    const existingUser = await UsersModel.findOne({
        $or: [
            { userName: userName },
            { email: userName }
        ]     
    });    

    if (!existingUser) {
        res.status(400).json({ message: "Invalid username or password"});
        return;
    }

    let isPasswordValid : Boolean = await bcrypt.compare(password, existingUser.password.toString());

    if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid username or password"});
        return;        
    }

    const token = Jwt.sign({ userId: existingUser._id }, SECRET_KEY, { expiresIn: '12h'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 43200000 // 12 hour expiration
    });
    console.log('success');
    res.redirect('/home/homepage');
})

export const retrieveProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let { sortBy } = req.body;
    const userID = req.user?.userId;

    if (!userID) {
        res.status(400).json({ message: "No token"});
        return 
    }

    if (!sortBy) {
        sortBy = "All";
    }

    let books = await BookModel.find({
        userID : userID
    });    

    let sortedBooks = books;

    switch (sortBy) {
        case "All": 
            break;
        case "In Progress":
            sortedBooks = books.filter(w => (w.pagesRead as number) > 0);
            break;
        case "Likes":
            sortedBooks = books.filter(w => w.review === "Positive");
            break;
        case "Dislikes": 
            sortedBooks = books.filter(w => w.review === "Negative");
            break;
        default: 
            break;
    }
    
    let pagesReadCounter: number = 0;
    let pagesLeftCounter: number = 0;
    let totalLikes: number = 0;
    let totalDislikes: number = 0;
    for (let i = 0; i < books.length; i++) {
        pagesReadCounter += books[i].pagesRead as number;
        pagesLeftCounter += ((books[i].totalPages as number) - (books[i].pagesRead as number))
        if (books[i].review === 'Positive') {
            totalLikes++;
        }
        else if (books[i].review === 'Negative') {
            totalDislikes++;
        }
    }

    let profileInfo: Profile = {
        totalBooks: books.length,
        totalRead: books.filter(w => w.pagesRead === w.totalPages).length,
        pagesRead: pagesReadCounter,
        pagesLeft: pagesLeftCounter,
        totalLikes: totalLikes,
        totalDislikes: totalDislikes
    };

    res.status(200).json({ books: sortedBooks, profile: profileInfo });
})

export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let { review, title } = req.body;
    const userID = req.user?.userId;

    if (!userID) {
        res.status(400).json({ message: "No token" });
        return;
    }

    let bookToUpdate = await BookModel.findOneAndUpdate(
        { title: title, userID: req.user?.userId},
        { $set: { review: review ? "Positive" : "Negative"}},
        { new: true}
    );

    if (!bookToUpdate) {
        res.status(400).json({ message: "Error updating review"});
        return;
    }

    res.status(200).json({ message: "Update successful"});
});

function validateUserInfo(name: String, email: String, userName: String, password: String, confirmPassword: String) : String
{
    let message: String = "";
    if (name.length == 0) {
        message = "Missing name field";
        return message;
    }

    if (email.length > 0) {
        if (!email.includes('@') || !email.includes('.')) {
            message = "Invalid email";
            return message;
        }
    }
    else {
        message = "Missing email field"
        return message;
    }

    if (userName.length == 0) {
        message = "Missing username";
        return message;
    }

    if (password !== confirmPassword) {
        message = "Mismatching passwords";
        return message;
    }


    return message;
}