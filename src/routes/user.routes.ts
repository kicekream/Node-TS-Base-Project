import express from "express"
const router = express.Router();

import { createUserHandler } from "../controller/user.controller";

import validateRequest from "../middleware/validateRequest"
import { createUserSchema } from "../schema/user.schema";


router.post("/api/register", validateRequest(createUserSchema), createUserHandler);

export default router;