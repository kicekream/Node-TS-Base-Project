import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
// import { omit } from "lodash";
import User, {UserDocument} from "../models/user.model";

import { createUser } from "../services/user.service";

import log from "../logger";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
    try {
        let {email, password} = req.body
        const findUser = await User.findOne({email});

        if(findUser)
            return res.status(400).send("User with email already exists")
        let rounds:number = parseInt(config.get("saltWork"))
        const salt = await bcrypt.genSalt(rounds)
        const hash = await bcrypt.hash(password, salt)
        req.body.password = hash;

        const newUser = await createUser(req.body)

        //omit some values
        //res.send(omit(newUser.toJSON()), "password")
        if(!newUser) {
            return res.status(400).send("An error occurred creating account");
        }
        log.info(`User ${newUser.first_name} Registered`)
        res.status(200).send("Thanks for sign up. Signup successful")
    } catch(e: any) {
        log.error(e)
        return res.status(409).send(e.message);
    }
}