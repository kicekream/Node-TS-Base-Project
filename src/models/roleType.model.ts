import mongoose from "mongoose";

import { UserDocument } from "./user.model";

export interface UserRoleDocument extends mongoose.Document {
    user: UserDocument["_id"];
    roleGroupId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserRoleSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    roleGroupId: {type: String}
}, {
    timestamps: true
})

const UserRole = mongoose.model<UserRoleDocument>("UserRole", UserRoleSchema)
export default UserRole;