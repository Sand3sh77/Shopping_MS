import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, GeneratePasswordProps, ValidatePasswordProps } from "./types";

dotenv.config();

const APP_SECRET = process.env.APP_SECRET as string;

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async ({
    password,
    salt
}: GeneratePasswordProps) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async ({
    enteredPassword,
    savedPassword
}: ValidatePasswordProps) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

export const GenerateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
}

export const ValidateSignature = async (req: Request) => {

    const signature = req.get('Authorization');

    if (signature) {
        try {
            const payload = jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
            req.user = payload;
            return true;

        } catch (err) {
            return false
        }
    }
    return false;
};
