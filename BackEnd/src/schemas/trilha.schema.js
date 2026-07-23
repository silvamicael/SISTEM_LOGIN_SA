import { z } from "zod";

export const gerarOpcoesTrilhaSchema = z.object({
    areaInteresse: z
        .string({ message: "Área de interesse, nível atual e nível objetivo são obrigatórios." })
        .trim()
        .min(1, "Área de interesse, nível atual e nível objetivo são obrigatórios."),
    nivelAtual: z
        .string({ message: "Área de interesse, nível atual e nível objetivo são obrigatórios." })
        .trim()
        .min(1, "Área de interesse, nível atual e nível objetivo são obrigatórios."),
    nivelObjetivo: z
        .string({ message: "Área de interesse, nível atual e nível objetivo são obrigatórios." })
        .trim()
        .min(1, "Área de interesse, nível atual e nível objetivo são obrigatórios.")
});

export const escolherTrilhaSchema = z.object({
    titulo: z
        .string({ message: "Título e descrição da trilha são obrigatórios." })
        .trim()
        .min(1, "Título e descrição da trilha são obrigatórios."),
    descricao: z
        .string({ message: "Título e descrição da trilha são obrigatórios." })
        .trim()
        .min(1, "Título e descrição da trilha são obrigatórios."),
    topicos: z.array(z.string()).optional(),
    habilidades: z.array(z.string()).optional(),
    areaInteresse: z.string().optional(),
    nivelAtual: z.string().optional(),
    nivelObjetivo: z.string().optional()
});
