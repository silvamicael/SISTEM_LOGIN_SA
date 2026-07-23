import { z } from "zod";

export const diagnosticoSchema = z.object({
    trilha: z
        .string({ message: 'O campo "trilha" é obrigatório.' })
        .trim()
        .min(1, 'O campo "trilha" é obrigatório.')
});

export const respostasSchema = z.object({
    respostas: z.array(z.unknown(), {
        message: 'O campo "respostas" deve ser uma lista.'
    })
});
