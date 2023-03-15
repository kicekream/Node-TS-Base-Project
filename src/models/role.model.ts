import mongoose from "mongoose";

import { PermissionDocument } from "./permission.model";

export interface RoleDocument extends mongoose.Document {
  roleName: string;
  permissionId: PermissionDocument["_id"];
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new mongoose.Schema(
  {
    roleName: { type: String },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
    groupId: { type: String },
  },
  { timestamps: true }
);

const Role = mongoose.model<RoleDocument>("Role", RoleSchema);

export default Role;
