import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { UsersModel } from '../src/models/users.js'
import Jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../src/js/authentication.js';
import bcrypt from 'bcrypt'

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
    })
    console.log('success');
    res.redirect('/home/homepage');
})

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