import { Router } from "express";
import { createUser, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { cadastroSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/cadastro", validate(cadastroSchema), createUser);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;