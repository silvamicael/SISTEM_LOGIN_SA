import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
    listarTrilhas,
    gerarOpcoesTrilha,
    escolherTrilha,
    buscarMinhaTrilha
} from "../controllers/trilha.controller.js";
import { gerarOpcoesTrilhaSchema, escolherTrilhaSchema } from "../schemas/trilha.schema.js";

const router = Router();

router.use(authJWT);

router.get("/", listarTrilhas);
router.get("/minha", buscarMinhaTrilha);
router.post("/gerar-opcoes", validate(gerarOpcoesTrilhaSchema), gerarOpcoesTrilha);
router.post("/escolher", validate(escolherTrilhaSchema), escolherTrilha);

export default router;