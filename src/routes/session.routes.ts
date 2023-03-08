import express from "express"
const router = express.Router();

import { createUserSessionHandler } from "../controller/session.controller";

import validateRequest from "../middleware/validateRequest"
import { createUserSchema, createUserSessionSchema } from "../schema/user.schema";


router.post("/api/login", validateRequest(createUserSessionSchema), createUserSessionHandler);

export default router;