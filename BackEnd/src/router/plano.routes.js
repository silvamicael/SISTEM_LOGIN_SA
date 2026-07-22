import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware.js";
import * as planoController from "../controllers/plano.controller.js";
import * as avaliacaoController from "../controllers/avaliacao.controller.js";

const router = Router();

router.use(authJWT);

router.get("/", planoController.listarPlanos);
router.get("/:id", planoController.buscarPlanoPorId);

router.post("/diagnostic", avaliacaoController.solicitarDiagnostico);
router.post("/:id/diagnostic/submit", avaliacaoController.submeterDiagnostico);

router.get("/:id/progress", avaliacaoController.gerarAvaliacaoProgresso);
router.post("/:id/progress/submit", avaliacaoController.submeterProgresso);

router.get("/:id/avaliacoes", avaliacaoController.listarHistorico);

export default router;