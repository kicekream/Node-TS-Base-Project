import Session from "../models/session.model"

export async function createSession(user_id: string, userAgent:string) {
    const session = await Session.create({user: user_id, userAgent});

    return session;
}