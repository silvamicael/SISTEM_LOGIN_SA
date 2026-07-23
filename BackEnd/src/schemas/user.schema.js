import { z } from "zod";
import { normalizarEmail, emailTemDominioValido } from "../utils/email.js";

export const updatePerfilSchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(3, "O nome deve ter no mínimo 3 caracteres.")
            .optional(),
        email: z
            .string()
            .trim()
            .min(1)
            .transform(normalizarEmail)
            .refine(emailTemDominioValido, "Informe um e-mail válido com domínio conhecido.")
            .optional(),
        novaSenha: z
            .string()
            .min(8, "A nova senha deve ter no mínimo 8 caracteres.")
            .optional(),
        confirmarNovaSenha: z.string().optional()
    })
    .refine(
        (dados) =>
            !dados.novaSenha ||
            dados.confirmarNovaSenha === undefined ||
            dados.novaSenha === dados.confirmarNovaSenha,
        {
            message: "A confirmação da nova senha não confere.",
            path: ["confirmarNovaSenha"]
        }
    );
