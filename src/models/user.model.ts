import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true})

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;