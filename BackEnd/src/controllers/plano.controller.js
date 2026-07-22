import { Plano } from "../models/index.js";

export async function listarPlanos(req, res) {
    try {
        const planos = await Plano.findAll({
            where: {
                usuarioId: req.usuario.id
            },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(planos);
    } catch (error) {
        console.error("Erro ao listar planos:", error);

        return res.status(500).json({
            erro: "Erro ao listar planos."
        });
    }
}

export async function buscarPlanoPorId(req, res) {
    try {
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
    } catch (error) {
        console.error("Erro ao buscar plano:", error);

        return res.status(500).json({
            erro: "Erro ao buscar plano."
        });
    }
}