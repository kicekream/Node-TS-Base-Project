import Session, { SessionDocument } from "../models/session.model";
import { decode, generateAuthToken } from "../utils/jwt.utils";
import { get } from "lodash";
import User from "../models/user.model";
import { findUserById } from "./user.service";
import config from "config"

export async function createSession(user_id: string, userAgent: string) {
  const session = await Session.create({ user: user_id, userAgent });

  return session;
}

export async function findSessions(query: object) {
  return Session.find(query).lean();
}

export async function updateSession(query: object, update: object) {
  return Session.updateOne(query, update);
}

export async function reIssueAccessToken({refreshToken}: {refreshToken: string}):Promise<string> {
  const {decoded} = decode(refreshToken);
  if(!decoded || !get(decoded, "session")) return "false"

  const session = await Session.findById(get(decoded, "session"));

  if(!session || !session.valid) return "false";

  const user = await findUserById(session.user)

  if(!user) return "false";

  const accessToken = generateAuthToken(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") } //expires in 15m
  );
  return accessToken;

}