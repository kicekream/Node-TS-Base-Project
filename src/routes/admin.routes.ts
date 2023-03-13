import express from "express";
const router = express.Router();

import validateRequest from "../middleware/validateRequest";

import {
  createPermissionHandler,
  createPermissionsHandler,
  getPermissionsHandler,
} from "../controller/admin.controller";

import {
  createPermissionSchema,
  createPermissionsSchema,
} from "../schema/admin.schema";

router.post(
  "/api/admin/permission",
  validateRequest(createPermissionSchema),
  createPermissionHandler
);

router.post(
  "/api/admin/permissions",
  validateRequest(createPermissionsSchema),
  createPermissionsHandler
);

router.get("/api/admin/permissions", getPermissionsHandler);

export default router;
