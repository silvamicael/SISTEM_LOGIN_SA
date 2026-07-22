import { Avaliacao, Plano } from "../models/index.js";
import * as gemini from "../services/gemini.service.js";

async function buscarPlanoDoUsuario(planoId, usuarioId) {
    return Plano.findOne({
        where: {
            id: planoId,
            usuarioId
        }
    });
}

function ocultarGabarito(perguntas = []) {
    return perguntas.map(({ respostaCorreta, ...pergunta }) => pergunta);
}

function corrigirAvaliacao(perguntas = [], respostas = []) {
    let acertos = 0;
    const desempenhoPorTopico = {};
    const topicosErrados = [];

    for (const pergunta of perguntas) {
        const resposta = respostas.find((item) => item.id === pergunta.id);
        const acertou = resposta?.respostaEscolhida === pergunta.respostaCorreta;

        if (!desempenhoPorTopico[pergunta.topico]) {
            desempenhoPorTopico[pergunta.topico] = {
                acertos: 0,
                total: 0
            };
        }

        desempenhoPorTopico[pergunta.topico].total += 1;

        if (acertou) {
            acertos += 1;
            desempenhoPorTopico[pergunta.topico].acertos += 1;
        } else {
            topicosErrados.push(pergunta.topico);
        }
    }

    const nota = perguntas.length
        ? Number(((acertos / perguntas.length) * 10).toFixed(2))
        : 0;

    return {
        nota,
        acertos,
        desempenhoPorTopico,
        topicosErrados
    };
}

function classificarNivel(nota) {
    if (nota >= 7) {
        return "avancado";
    }

    if (nota >= 4) {
        return "intermediario";
    }

    return "iniciante";
}

export async function solicitarDiagnostico(req, res) {
    try {
        const { trilha } = req.body;

        if (!trilha) {
            return res.status(400).json({
                erro: 'O campo "trilha" é obrigatório.'
            });
        }

        const plano = await Plano.create({
            trilha,
            usuarioId: req.usuario.id
        });

        const perguntas = await gemini.gerarAvaliacaoDiagnostica(trilha);

        const avaliacao = await Avaliacao.create({
            planoId: plano.id,
            tipo: "diagnostica",
            perguntas
        });

        return res.status(201).json({
            mensagem: "Diagnóstico gerado com sucesso.",
            planoId: plano.id,
            avaliacaoId: avaliacao.id,
            perguntas: ocultarGabarito(perguntas)
        });
    } catch (error) {
        console.error("Erro ao gerar diagnóstico:", error);

        return res.status(500).json({
            erro: "Erro ao gerar diagnóstico."
        });
    }
}

export async function submeterDiagnostico(req, res) {
    try {
        const { id } = req.params;
        const { respostas } = req.body;

        if (!Array.isArray(respostas)) {
            return res.status(400).json({
                erro: 'O campo "respostas" deve ser uma lista.'
            });
        }

        const plano = await buscarPlanoDoUsuario(id, req.usuario.id);

        if (!plano) {
            return res.status(404).json({
                erro: "Plano não encontrado."
            });
        }

        const avaliacao = await Avaliacao.findOne({
            where: {
                planoId: plano.id,
                tipo: "diagnostica",
                status: "pendente"
            },
            order: [["createdAt", "DESC"]]
        });

        if (!avaliacao) {
            return res.status(404).json({
                erro: "Não há diagnóstico pendente para este plano."
            });
        }

        const resultado = corrigirAvaliacao(avaliacao.perguntas, respostas);
        const nivel = classificarNivel(resultado.nota);

        await avaliacao.update({
            respostasAluno: respostas,
            nota: resultado.nota,
            nivelClassificado: nivel,
            status: "respondida"
        });

        const planoGerado = await gemini.gerarPlanoEnsino(
            plano.trilha,
            nivel,
            resultado.desempenhoPorTopico
        );

        await plano.update({
            nivel,
            conteudosPrioritarios: planoGerado.conteudosPrioritarios,
            metas: planoGerado.metas,
            status: "ativo"
        });

        return res.status(200).json({
            mensagem: "Diagnóstico corrigido e plano gerado.",
            nota: resultado.nota,
            nivel,
            plano
        });
    } catch (error) {
        console.error("Erro ao processar diagnóstico:", error);

        return res.status(500).json({
            erro: "Erro ao processar diagnóstico."
        });
    }
}

export async function gerarAvaliacaoProgresso(req, res) {
    try {
        const { id } = req.params;

        const plano = await buscarPlanoDoUsuario(id, req.usuario.id);

        if (!plano) {
            return res.status(404).json({
                erro: "Plano não encontrado."
            });
        }

        const historico = await Avaliacao.findAll({
            where: {
                planoId: plano.id,
                tipo: "progresso",
                status: "respondida"
            },
            order: [["createdAt", "ASC"]]
        });

        let avaliacao = await Avaliacao.findOne({
            where: {
                planoId: plano.id,
                tipo: "progresso",
                status: "pendente"
            },
            order: [["createdAt", "DESC"]]
        });

        if (!avaliacao) {
            const notasAnteriores = historico.map((item) => item.nota);

            const resultadoIA = await gemini.gerarAvaliacaoProgresso(
                plano.trilha,
                plano.nivel,
                notasAnteriores
            );

            avaliacao = await Avaliacao.create({
                planoId: plano.id,
                tipo: "progresso",
                perguntas: resultadoIA.perguntas,
                dificuldade: resultadoIA.dificuldade || "medio"
            });
        }

        return res.status(200).json({
            plano,
            historico: historico.map((item) => ({
                id: item.id,
                nota: item.nota,
                dificuldade: item.dificuldade,
                feedback: item.feedback,
                data: item.createdAt
            })),
            avaliacaoPendente: {
                id: avaliacao.id,
                dificuldade: avaliacao.dificuldade,
                perguntas: ocultarGabarito(avaliacao.perguntas)
            }
        });
    } catch (error) {
        console.error("Erro ao gerar avaliação de progresso:", error);

        return res.status(500).json({
            erro: "Erro ao gerar avaliação de progresso."
        });
    }
}

export async function submeterProgresso(req, res) {
    try {
        const { id } = req.params;
        const { respostas } = req.body;

        if (!Array.isArray(respostas)) {
            return res.status(400).json({
                erro: 'O campo "respostas" deve ser uma lista.'
            });
        }

        const plano = await buscarPlanoDoUsuario(id, req.usuario.id);

        if (!plano) {
            return res.status(404).json({
                erro: "Plano não encontrado."
            });
        }

        const avaliacao = await Avaliacao.findOne({
            where: {
                planoId: plano.id,
                tipo: "progresso",
                status: "pendente"
            },
            order: [["createdAt", "DESC"]]
        });

        if (!avaliacao) {
            return res.status(404).json({
                erro: "Não há avaliação de progresso pendente."
            });
        }

        const resultado = corrigirAvaliacao(avaliacao.perguntas, respostas);
        const feedback = await gemini.gerarFeedback(resultado.nota, resultado.topicosErrados);

        await avaliacao.update({
            respostasAluno: respostas,
            nota: resultado.nota,
            feedback,
            status: "respondida"
        });

        const planoAjustado = await gemini.ajustarPlano(plano.toJSON(), resultado);

        await plano.update({
            nivel: planoAjustado.nivel || plano.nivel,
            conteudosPrioritarios: planoAjustado.conteudosPrioritarios || plano.conteudosPrioritarios,
            metas: planoAjustado.metas || plano.metas
        });

        return res.status(200).json({
            mensagem: "Avaliação corrigida e plano atualizado.",
            nota: resultado.nota,
            acertos: resultado.acertos,
            feedback,
            plano
        });
    } catch (error) {
        console.error("Erro ao processar progresso:", error);

        return res.status(500).json({
            erro: "Erro ao processar avaliação de progresso."
        });
    }
}

export async function listarHistorico(req, res) {
    try {
        const { id } = req.params;

        const plano = await buscarPlanoDoUsuario(id, req.usuario.id);

        if (!plano) {
            return res.status(404).json({
                erro: "Plano não encontrado."
            });
        }

        const avaliacoes = await Avaliacao.findAll({
            where: {
                planoId: plano.id,
                status: "respondida"
            },
            attributes: [
                "id",
                "tipo",
                "nota",
                "nivelClassificado",
                "dificuldade",
                "feedback",
                "createdAt"
            ],
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(avaliacoes);
    } catch (error) {
        console.error("Erro ao listar histórico:", error);

        return res.status(500).json({
            erro: "Erro ao listar avaliações."
        });
    }
}