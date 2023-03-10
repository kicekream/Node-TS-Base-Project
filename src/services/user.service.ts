import { DocumentDefinition } from "mongoose";
import User, { UserDocument } from "../models/user.model";
import { omit } from "lodash";

export async function createUser(
  input: DocumentDefinition<
    Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">
  >
) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), ["password", "createdAt", "updatedAt", "__V"]);
}

export async function findUserById(userId: string) {
  return await User.findById(userId).select("-password -createdAt -updatedAt").lean()

}
