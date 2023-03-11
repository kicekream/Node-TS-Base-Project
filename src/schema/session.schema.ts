import { object, string, TypeOf } from "zod";

export const createUserSessionSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Must be a Valid email"
    ),
    password: string({ required_error: "password is required" }).min(
      6,
      "Password must be at least 6 characters"
    ),
  }),
});
