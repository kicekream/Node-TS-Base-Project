import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Must be a Valid email"
    ),
    first_name: string({ required_error: "first_name is required" }),
    last_name: string({ required_error: "last_name is required" }),
    password: string({ required_error: "password is required" }).min(
      6,
      "Password must be at least 6 characters"
    ),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }).min(6, "Password must be at least 6 characters"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
