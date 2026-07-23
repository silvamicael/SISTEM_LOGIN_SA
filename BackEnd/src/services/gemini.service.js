import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
}

const ai = new GoogleGenAI({
    apiKey,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

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

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gerarTexto(prompt) {
    const tentativas = 3;
    let ultimoErro;

    for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
        try {
            console.log(`🤖 Consultando Gemini... tentativa ${tentativa}/${tentativas}`);

            const response = await ai.models.generateContent({
                model: MODEL,
                contents: prompt,
            });

            const texto = response.text?.trim();

            if (!texto) {
                throw new Error("Resposta vazia da Gemini.");
            }

            console.log("✅ Resposta recebida.");

            return texto;

        } catch (error) {
            ultimoErro = error;

            console.error(`❌ Erro na tentativa ${tentativa}:`, error.message);

            if (tentativa < tentativas) {
                await esperar(tentativa * 2000);
            }
        }
    }

    throw criarErroGemini(
        ultimoErro?.message || "Erro ao consultar Gemini.",
        ultimoErro?.status || 500
    );
}

async function gerarJSON(prompt) {
    const texto = await gerarTexto(prompt);

    try {
        return extrairJson(texto);
    } catch (error) {
        console.error(texto);
        throw criarErroGemini(
            "A Gemini retornou um JSON inválido.",
            502
        );
    }
}

export async function gerarOpcoesTrilha(areaInteresse, nivelAtual, nivelObjetivo) {

    const prompt = `
Você é um especialista em educação adaptativa.

Crie exatamente 3 trilhas.

Área de interesse: ${areaInteresse}
Nível atual: ${nivelAtual}
Nível desejado: ${nivelObjetivo}

Retorne SOMENTE um JSON válido.

[
 {
   "titulo":"",
   "descricao":"",
   "topicos":[""],
   "habilidades":[""],
   "areaInteresse":"",
   "nivelAtual":"",
   "nivelObjetivo":""
 }
]
`;

    return gerarJSON(prompt);
}

export async function gerarAvaliacaoDiagnostica(trilha) {

    const prompt = `
Você é um professor.

Crie exatamente 5 questões.

Trilha:

${trilha}

Retorne SOMENTE JSON.

[
 {
   "id":1,
   "enunciado":"",
   "topico":"",
   "alternativas":["","","",""],
   "respostaCorreta":0
 }
]
`;

    return gerarJSON(prompt);
}

export async function gerarAvaliacaoProgresso(
    trilha,
    nivel = "iniciante",
    notasAnteriores = []
) {

    const prompt = `
Você é um professor.

Trilha:

${trilha}

Nível:

${nivel}

Notas:

${JSON.stringify(notasAnteriores)}

Retorne SOMENTE JSON.

{
    "dificuldade":"",
    "perguntas":[
        {
            "id":1,
            "enunciado":"",
            "topico":"",
            "alternativas":["","","",""],
            "respostaCorreta":0
        }
    ]
}
`;

    return gerarJSON(prompt);
}

export async function gerarPlanoEnsino(
    trilha,
    nivel,
    desempenhoPorTopico = {}
) {

    const prompt = `
Você é um orientador pedagógico.

Trilha:

${trilha}

Nível:

${nivel}

Desempenho:

${JSON.stringify(desempenhoPorTopico)}

Retorne SOMENTE JSON.

{
    "conteudosPrioritarios":[],
    "metas":[],
    "observacoes":""
}
`;

    return gerarJSON(prompt);
}

export async function gerarFeedback(
    nota,
    topicosErrados = []
) {

    const prompt = `
Você é um professor.

Nota:

${nota}/10

Tópicos com dificuldade:

${topicosErrados.join(", ") || "Nenhum"}

Escreva um feedback curto, objetivo e motivador.
`;

    return gerarTexto(prompt);
}

export async function ajustarPlano(
    plano,
    resultado
) {

    const prompt = `
Você é um orientador pedagógico.

Plano atual:

${JSON.stringify(plano)}

Resultado:

${JSON.stringify(resultado)}

Retorne SOMENTE JSON.

{
    "nivel":"",
    "conteudosPrioritarios":[],
    "metas":[]
}
`;

    return gerarJSON(prompt);
}