import { Plano } from "../models/index.js";

export async function listarPlanos(req, res) {
    const planos = await Plano.findAll({
        where: {
            usuarioId: req.usuario.id
        },
        order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(planos);
}

export async function buscarPlanoPorId(req, res) {
    const plano = await Plano.findOne({
        where: {
            id: req.params.id,
            usuarioId: req.usuario.id
        }
    });

    if (!plano) {
        return res.status(404).json({
            erro: "Plano não encontrado."
        });
    }

    return res.status(200).json(plano);
}
