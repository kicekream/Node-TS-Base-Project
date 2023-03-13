import {
  createPermission,
  createPermissions,
  getPermissions,
} from "../services/admin.service";
import { Request, Response } from "express";
import log from "../logger";

export async function createPermissionHandler(req: Request, res: Response) {
  try {
    const { permission, description } = req.body;
    const permData = await createPermission(permission, description);
    if (!permData.status) {
      return res.status(permData.code).send(permData.message);
    }
    log.info("Permission Successfully Added");
    res.status(permData.code).send(permData.message);
  } catch (err) {
    log.error(`Error:::: ${err}`);
    res.status(500).send("An error occurred");
  }
}

export async function createPermissionsHandler(req: Request, res: Response) {
  try {
    const { permissions, code } = req.body;
    const permsData = await createPermissions(permissions, code);
    if (!permsData.status) {
      return res.status(permsData.code).send(permsData.message);
    }
    log.info("Permissions Successfully Added");
    res.status(permsData.code).send(permsData.message);
  } catch (err) {
    log.error(`Error:::: ${err}`);
    res.status(500).send("An error occurred");
  }
}

export async function getPermissionsHandler(req: Request, res: Response) {
  try {
    const permissions = await getPermissions();
    if (!permissions.status) {
      return res.status(permissions.code).send(permissions.message);
    }
    res.status(permissions.code).send(permissions.message);
  } catch (err) {
    log.error(`Error:::: ${err}`);
    res.status(500).send("An error occurred");
  }
}
