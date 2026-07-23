import { z } from "zod";
import { normalizarEmail, emailTemDominioValido } from "../utils/email.js";

const emailSchema = z
    .string({ message: "E-mail é obrigatório." })
    .trim()
    .min(1, "E-mail é obrigatório.")
    .transform(normalizarEmail)
    .refine(emailTemDominioValido, "Informe um e-mail válido com domínio conhecido.");

export const cadastroSchema = z
    .object({
        nome: z
            .string({ message: "Nome é obrigatório." })
            .trim()
            .min(3, "O nome deve ter no mínimo 3 caracteres."),
        email: emailSchema,
        senha: z
            .string({ message: "Senha é obrigatória." })
            .min(8, "A senha deve ter no mínimo 8 caracteres."),
        confirmarSenha: z.string().optional()
    })
    .refine(
        (dados) => dados.confirmarSenha === undefined || dados.senha === dados.confirmarSenha,
        {
            message: "A confirmação de senha não confere.",
            path: ["confirmarSenha"]
        }
    );

export const loginSchema = z.object({
    email: emailSchema,
    senha: z.string({ message: "Senha é obrigatória." }).min(1, "Senha é obrigatória.")
});
