import express from "express"
const router = express.Router();

import deserializeUser from "../middleware/deserializeUser";

import { createUserSessionHandler, getUserSessionHandler } from "../controller/session.controller";

import validateRequest from "../middleware/validateRequest"
import { createUserSessionSchema } from "../schema/session.schema";


router.post("/api/login", validateRequest(createUserSessionSchema), createUserSessionHandler);

router.get("/api/sessions",deserializeUser, getUserSessionHandler)

export default router;