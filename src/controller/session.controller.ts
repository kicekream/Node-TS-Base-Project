import { Request, Response } from "express";
import config from "config"
import { createSession } from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { generateAuthToken } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
    //validate user password
    const {email, password} = req.body
    const user = await validatePassword(email, password)

    if(!user) {
        return res.status(401).send("Invalid email or password provided")
    }
    //create session
    const session = await createSession(user._id, req.get("user-agent") || "")

    //create access token
    const accessToken = generateAuthToken({
        ...user, session: session._id}, {expiresIn: config.get("accessTokenTtl")} //expires in 15m
    )

    //create refresh token
    const refreshToken = generateAuthToken({
        ...user, session: session._id}, {expiresIn: config.get("refreshTokenTtl")} //expires in 15m
    );

    res.send({accessToken, refreshToken})

    //return access and refresh token
}