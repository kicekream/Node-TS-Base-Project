import { Request, Response } from "express";
import config from "config";
import Session from "../models/session.model";
import {
  createSession,
  reIssueAccessToken,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { generateAuthToken } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate user password
  const { email, password } = req.body;
  const user = await validatePassword(email, password);

  if (!user) {
    return res.status(401).send("Invalid email or password provided");
  }
  //create session
  const session = await createSession(user._id, req.get("user-agent") || "");

  //create access token
  const accessToken = generateAuthToken(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") } //expires in 15m
  );

  //create refresh token
  const refreshToken = generateAuthToken(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("refreshTokenTtl") } //expires in 1y
  );

  res.send({ accessToken, refreshToken });

  //return access and refresh token
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const sessions = await Session.find({
    user: res.locals._user._id,
    valid: true,
  });
  res.send(sessions);
}

export async function updateSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals._user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export async function reIssueAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.header("x-refresh");
  if (!refreshToken) return res.status(403).send("Refresh Token invalid");
  const newAccessToken: string = await reIssueAccessToken({ refreshToken });

  res.send({ accessToken: newAccessToken, refreshToken });
}
