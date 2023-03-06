import mongoose from "mongoose";
import bcrypt from "bcrypt";


export interface UserDocument {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;