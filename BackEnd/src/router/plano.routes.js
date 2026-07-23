import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import * as planoController from "../controllers/plano.controller.js";
import * as avaliacaoController from "../controllers/avaliacao.controller.js";
import { diagnosticoSchema, respostasSchema } from "../schemas/avaliacao.schema.js";

const router = Router();

router.use(authJWT);

router.get("/", planoController.listarPlanos);
router.get("/:id", planoController.buscarPlanoPorId);

router.post("/diagnostic", validate(diagnosticoSchema), avaliacaoController.solicitarDiagnostico);
router.post("/:id/diagnostic/submit", validate(respostasSchema), avaliacaoController.submeterDiagnostico);

router.get("/:id/progress", avaliacaoController.gerarAvaliacaoProgresso);
router.post("/:id/progress/submit", validate(respostasSchema), avaliacaoController.submeterProgresso);

router.get("/:id/avaliacoes", avaliacaoController.listarHistorico);

export default router;