import {get} from "lodash"
import { decode } from "../utils/jwt.utils";
import { Request, Response, NextFunction } from "express";

const deserializeUser = (req: Request, res:Response, next: NextFunction) => {
    // const token = get(req, "headers.authorization")
    const token = req.header("x-auth-token")
    if(!token) return res.status(401).send("Access Denied, no token provided");

    const {decoded:data, expired} = decode(token);
    if(!data) {
        return res.status(400).send("Invalid Token Provided")
    }    
    res.locals._user = data;
    // console.log(data)
    next();
}
export default deserializeUser