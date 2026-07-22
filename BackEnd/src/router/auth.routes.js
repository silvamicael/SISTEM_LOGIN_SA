import { Router } from "express";
import { createUser, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/cadastro", createUser);
router.post("/login", login);

export default router;