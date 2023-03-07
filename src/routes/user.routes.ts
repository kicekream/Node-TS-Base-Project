import express from "express"

import { createUserHandler } from "../controller/user.controller";

import validateRequest from "../middleware/validateRequest"
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("api/user/register", validateRequest(createUserSchema), createUserHandler);

export default router;