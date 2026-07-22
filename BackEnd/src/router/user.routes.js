import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware.js";
import {
    getPerfil,
    updatePerfil,
    deleteConta
} from "../controllers/user.controller.js";

const router = Router();

router.use(authJWT);

router.get("/perfil", getPerfil);
router.put("/perfil", updatePerfil);
router.delete("/conta", deleteConta);

export default router;