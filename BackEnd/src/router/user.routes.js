import { Router } from "express";
import { limitadorGetUser } from "../config/rateLimit.js";
import { authJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
    getPerfil,
    updatePerfil,
    deleteConta
} from "../controllers/user.controller.js";
import { updatePerfilSchema } from "../schemas/user.schema.js";

const router = Router();

router.use(authJWT);

router.get("/perfil", limitadorGetUser, getPerfil);
router.put("/perfil", validate(updatePerfilSchema), updatePerfil);
router.delete("/conta", deleteConta);

export default router;