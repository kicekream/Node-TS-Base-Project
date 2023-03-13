import mongoose from "mongoose";

export interface PermissionDocument extends mongoose.Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new mongoose.Schema<PermissionDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Permission = mongoose.model<PermissionDocument>("Permission", permissionSchema);

export default Permission;
