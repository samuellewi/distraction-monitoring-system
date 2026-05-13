import { Router } from "express";
import { login, me, register } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { authSchemas } from "../utils/schemas";
import { validate } from "../utils/validation";

export const authRouter = Router();

authRouter.post("/register", validate(authSchemas.register), asyncHandler(register));
authRouter.post("/login", validate(authSchemas.login), asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(me));
