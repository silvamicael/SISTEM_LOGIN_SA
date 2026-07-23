import { Trilha, User } from "../models/index.js";
import * as gemini from "../services/gemini.service.js";

export async function listarTrilhas(req, res) {
    const trilhas = await Trilha.findAll({
        where: { ativa: true },
        order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(trilhas);
}

export async function gerarOpcoesTrilha(req, res) {
    const { areaInteresse, nivelAtual, nivelObjetivo } = req.body;

    const opcoes = await gemini.gerarOpcoesTrilha(
        areaInteresse,
        nivelAtual,
        nivelObjetivo
    );

    return res.status(200).json({
        mensagem: "Opções de trilha geradas com sucesso.",
        opcoes
    });
}

export async function escolherTrilha(req, res) {
    const {
        titulo,
        descricao,
        topicos,
        habilidades,
        areaInteresse,
        nivelAtual,
        nivelObjetivo
    } = req.body;

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
}

export async function buscarMinhaTrilha(req, res) {
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
}
