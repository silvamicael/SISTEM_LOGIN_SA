import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

function getModel() {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY não configurada.");
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    return genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });
}

function extrairJson(texto) {
    const textoLimpo = texto
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(textoLimpo);
}

function criarErroGemini(mensagem, status = 500) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}

async function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gerarConteudoJSON(prompt) {
    const tentativas = 3;
    let ultimoErro = null;

    for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
        try {
            const model = getModel();

            console.log(`🤖 Consultando Gemini... tentativa ${tentativa}/${tentativas}`);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text || !text.trim()) {
                throw criarErroGemini("A Gemini retornou uma resposta vazia.", 502);
            }

            const json = extrairJson(text);

            console.log("✅ Resposta recebida da Gemini.");
            return json;
        } catch (error) {
            ultimoErro = error;
            console.error(`❌ Erro na tentativa ${tentativa}:`, error.message);

            const ultimaTentativa = tentativa === tentativas;

            if (!ultimaTentativa) {
                const tempoEspera = tentativa * 2000;
                console.log(`⏳ Aguardando ${tempoEspera}ms para tentar novamente...`);
                await esperar(tempoEspera);
            }
        }
    }

    const status = ultimoErro?.status || 503;

    throw criarErroGemini(
        "A Gemini está indisponível no momento. Tente novamente em instantes.",
        status
    );
}

export async function gerarOpcoesTrilha(areaInteresse, nivelAtual, nivelObjetivo) {
    const prompt = `
Você é um especialista em educação adaptativa.

Crie 3 opções de trilhas de aprendizagem em português com base nestes dados:

Área de interesse: ${areaInteresse}
Nível atual do aluno: ${nivelAtual}
Nível desejado: ${nivelObjetivo}

Retorne SOMENTE um JSON válido no formato de array, sem markdown, sem explicações.

Cada item do array deve conter:
- titulo
- descricao
- topicos (array)
- habilidades (array)
- areaInteresse
- nivelAtual
- nivelObjetivo
`;

    return gerarConteudoJSON(prompt);
}

export async function gerarAvaliacaoDiagnostica(trilha) {
    const prompt = `
Você é um especialista em educação e deve gerar uma avaliação diagnóstica.

Trilha: ${trilha}

Gere exatamente 5 questões de múltipla escolha, em português, com nível introdutório.

Cada questão deve conter:
- id
- enunciado
- topico
- alternativas (array com 4 alternativas)
- respostaCorreta

Responda SOMENTE em JSON válido, como array.
`;

    return gerarConteudoJSON(prompt);
}

export async function gerarAvaliacaoProgresso(trilha, nivel = "iniciante", notasAnteriores = []) {
    const prompt = `
Você é um especialista em educação adaptativa.

Trilha: ${trilha}
Nível atual do aluno: ${nivel}
Notas anteriores: ${JSON.stringify(notasAnteriores)}

Gere uma avaliação de progresso com 3 questões de múltipla escolha em português.

Retorne em JSON com:
- dificuldade
- perguntas (array)

Cada pergunta deve conter:
- id
- enunciado
- topico
- alternativas
- respostaCorreta
`;

    return gerarConteudoJSON(prompt);
}

export async function gerarPlanoEnsino(trilha, nivel, desempenhoPorTopico = {}) {
    const prompt = `
Você é um orientador pedagógico.

Trilha: ${trilha}
Nível do aluno: ${nivel}
Desempenho por tópico: ${JSON.stringify(desempenhoPorTopico)}

Gere um plano de ensino personalizado em português.

Retorne em JSON com:
- conteudosPrioritarios (array)
- metas (array)
- observacoes (string)
`;

    return gerarConteudoJSON(prompt);
}

export async function gerarFeedback(nota, topicosErrados = []) {
    try {
        const model = getModel();

        console.log("🤖 Consultando Gemini para feedback...");

        const prompt = `
Você é um professor que dá feedback claro e motivador.

Nota do aluno: ${nota}/10
Tópicos com dificuldade: ${topicosErrados.join(", ") || "nenhum informado"}

Gere um feedback curto, em português, motivador e objetivo.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        if (!text) {
            throw criarErroGemini("A Gemini retornou feedback vazio.", 502);
        }

        console.log("✅ Feedback recebido da Gemini.");
        return text;
    } catch (error) {
        console.error("❌ Erro ao gerar feedback com Gemini:", error);
        throw criarErroGemini(
            "Não foi possível gerar o feedback com a Gemini agora.",
            error?.status || 503
        );
    }
}

export async function ajustarPlano(plano, resultado) {
    const prompt = `
Você é um orientador pedagógico.

Plano atual:
${JSON.stringify(plano)}

Resultado da avaliação:
${JSON.stringify(resultado)}

Retorne um JSON com:
- nivel
- conteudosPrioritarios (array)
- metas (array)
`;

    return gerarConteudoJSON(prompt);
}