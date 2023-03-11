import { get } from "lodash";
import { decode } from "../utils/jwt.utils";
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../services/session.service";

const deserializeUser = async(req: Request, res: Response, next: NextFunction) => {
  // const token = get(req, "headers.authorization")
  const token = req.header("x-auth-token");
  const refreshToken = req.header("x-refresh");
  if (!token) return res.status(401).send("Access Denied, no token provided");

  const { decoded: data, expired } = decode(token);
/*   console.log("Decoded Data: ", data)
  console.log("Expired Data: ", expired)
  if(expired && refreshToken) {
    //reissue an access token to the user
    console.log("Trying to reissue access TOKEN HEREEEEE")
    const newAccessToken:string = await reIssueAccessToken({refreshToken})
    
    console.log("ACCESSS TOKEN REISSUED")
    if(newAccessToken) {
      res.setHeader("x-auth-token", newAccessToken);
    }
    const result = await decode(newAccessToken);
    console.log("RESULT OF DECODED HERE: ", result)
    res.locals._user = result.decoded
    next();
  } */
  if (!data) {
    return res.status(400).send("Invalid Token Provided");
  }
  res.locals._user = data;
  next();
  // console.log(data)
};
export default deserializeUser;
