import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import User, {UserDocument} from "../models/user.model";

import { createUser } from "../services/user.service";

import log from "../logger";

export async function createUserHandler(req: Request, res: Response) {
    try {
        let {email, first_name, last_name, password} = req.body
        const findUser = await User.findOne({email});

        if(findUser)
            return res.status(400).send("User with email already exists")
        
        const salt = await bcrypt.genSalt(config.get<number>("saltWork"))
        const hash = await bcrypt.hash(password, salt)
        password = hash;

        const newUser = await createUser(req.body)

        if(!newUser) {
            return res.status(400).send("An error occurred creating account");
        }
        log.info(newUser,"User Registered")
        res.status(200).send("Thanks for sign up. Signup successful")
    } catch(e: any) {
        log.error(e)
        return res.status(409).send(e.message);
    }
}