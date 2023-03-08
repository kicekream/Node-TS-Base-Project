import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get("privateKey") as string;

export function generateAuthToken(
  data: Object,
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(data, privateKey);
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey);
    return {
        valid: true,
        expired: false,
        decoded
      };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
