import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { UsersModel } from '../src/models/users.js'

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

    const newUser = new UsersModel({
        name: fullName,
        email: email,
        userName: userName,
        password: password
    }); // hash password 

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser});
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