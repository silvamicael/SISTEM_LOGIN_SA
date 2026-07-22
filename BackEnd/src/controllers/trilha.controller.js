import { Trilha, User } from "../models/index.js";
import * as gemini from "../services/gemini.service.js";

export async function listarTrilhas(req, res) {
    try {
        const trilhas = await Trilha.findAll({
            where: { ativa: true },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(trilhas);
    } catch (error) {
        console.error("Erro ao listar trilhas:", error);

        return res.status(500).json({
            erro: "Erro ao listar trilhas."
        });
    }
}

export async function gerarOpcoesTrilha(req, res) {
    try {
        const { areaInteresse, nivelAtual, nivelObjetivo } = req.body;

        if (!areaInteresse || !nivelAtual || !nivelObjetivo) {
            return res.status(400).json({
                erro: "Área de interesse, nível atual e nível objetivo são obrigatórios."
            });
        }

        const opcoes = await gemini.gerarOpcoesTrilha(
            areaInteresse,
            nivelAtual,
            nivelObjetivo
        );

        return res.status(200).json({
            mensagem: "Opções de trilha geradas com sucesso.",
            opcoes
        });
    } catch (error) {
        console.error("Erro ao gerar opções de trilha:", error);

        return res.status(error.status || 500).json({
            erro: error.message || "Erro ao gerar trilhas com Gemini."
        });
    }
}

export async function escolherTrilha(req, res) {
    try {
        const {
            titulo,
            descricao,
            topicos,
            habilidades,
            areaInteresse,
            nivelAtual,
            nivelObjetivo
        } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({
                erro: "Título e descrição da trilha são obrigatórios."
            });
        }

        const usuario = await User.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        const trilha = await Trilha.create({
            titulo,
            descricao,
            topicos,
            habilidades,
            areaInteresse,
            nivelAtual,
            nivelObjetivo,
            origem: "gemini"
        });

        usuario.trilhaId = trilha.id;
        usuario.nivelAtual = nivelAtual;
        usuario.nivelObjetivo = nivelObjetivo;

        await usuario.save();

        return res.status(201).json({
            mensagem: "Trilha escolhida com sucesso.",
            trilha
        });
    } catch (error) {
        console.error("Erro ao escolher trilha:", error);

        return res.status(500).json({
            erro: "Erro ao salvar trilha escolhida."
        });
    }
}

export async function buscarMinhaTrilha(req, res) {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            attributes: {
                exclude: ["senha"]
            },
            include: [
                {
                    model: Trilha,
                    as: "trilha"
                }
            ]
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nivelAtual: usuario.nivelAtual,
                nivelObjetivo: usuario.nivelObjetivo
            },
            trilha: usuario.trilha || null
        });
    } catch (error) {
        console.error("Erro ao buscar trilha do usuário:", error);

        return res.status(500).json({
            erro: "Erro ao buscar trilha do usuário."
        });
    }
}