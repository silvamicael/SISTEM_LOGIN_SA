import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware.js";
import {
    listarTrilhas,
    gerarOpcoesTrilha,
    escolherTrilha,
    buscarMinhaTrilha
} from "../controllers/trilha.controller.js";

const router = Router();

router.use(authJWT);

router.get("/", listarTrilhas);
router.get("/minha", buscarMinhaTrilha);
router.post("/gerar-opcoes", gerarOpcoesTrilha);
router.post("/escolher", escolherTrilha);

export default router;