import config from "config";
import Permission, { PermissionDocument } from "../models/permission.model";
interface Response {
  code: number;
  status: boolean;
  message?: string | PermissionDocument;
}

export async function createPermission(
  permission: string,
  description: string
) {
  const defaultResponse: Response = {
    code: 400,
    status: false,
    message: "Permisison Name Already Exists",
  };
  const permExists = await Permission.findOne({ name: permission });
  if (permExists) {
    return defaultResponse;
  }

  const data = await Permission.create({ name: permission, description });

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;

  return defaultResponse;
}

export async function createPermissions(
  permissions: any,
  permissionCode: string
) {
  const permCode = config.get("permissionCode");

  const defaultResponse: Response = {
    code: 400,
    status: false,
    message: "Invalid Permission Code provided",
  };
  if (permCode !== permissionCode) {
    return defaultResponse;
  }
  if (!permissions || permissions.length < 1) {
    defaultResponse.message = "Incorrect Permission Data Provided";
    return defaultResponse;
  }
  const data = await Permission.insertMany(permissions);
  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;

  return defaultResponse;
}

export async function getPermissions() {
  const defaultResponse: Response = {
    code: 404,
    status: false,
    message: "No Permission Found",
  };
  const data = await Permission.find().select("_id name description");
  if (data.length < 1) return defaultResponse;

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;
  return defaultResponse;
}
