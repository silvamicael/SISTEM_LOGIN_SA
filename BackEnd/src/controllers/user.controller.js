import bcrypt from "bcrypt";
import { User } from "../models/index.js";

const DOMINIOS_PERMITIDOS = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "live.com"
];

function normalizarEmail(email) {
    return email.trim().toLowerCase();
}

function emailTemDominioValido(email) {
    const partes = email.split("@");

    if (partes.length !== 2) {
        return false;
    }

    return DOMINIOS_PERMITIDOS.includes(partes[1]);
}

export async function getPerfil(req, res) {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            attributes: {
                exclude: ["senha"]
            }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}

export async function updatePerfil(req, res) {
    try {
        const { nome, email, novaSenha, confirmarNovaSenha } = req.body;

        const usuario = await User.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (nome !== undefined) {
            if (nome.trim().length < 3) {
                return res.status(400).json({
                    erro: "O nome deve ter no mínimo 3 caracteres."
                });
            }

            usuario.nome = nome.trim();
        }

        if (email !== undefined) {
            const emailNormalizado = normalizarEmail(email);

            if (!emailTemDominioValido(emailNormalizado)) {
                return res.status(400).json({
                    erro: "Informe um e-mail válido com domínio conhecido."
                });
            }

            const emailExistente = await User.findOne({
                where: {
                    email: emailNormalizado
                }
            });

            if (emailExistente && emailExistente.id !== usuario.id) {
                return res.status(409).json({
                    erro: "E-mail já cadastrado."
                });
            }

            usuario.email = emailNormalizado;
        }

        if (novaSenha) {
            if (novaSenha.length < 8) {
                return res.status(400).json({
                    erro: "A nova senha deve ter no mínimo 8 caracteres."
                });
            }

            if (confirmarNovaSenha !== undefined && novaSenha !== confirmarNovaSenha) {
                return res.status(400).json({
                    erro: "A confirmação da nova senha não confere."
                });
            }

            usuario.senha = await bcrypt.hash(novaSenha, 10);
        }

        await usuario.save();

        const usuarioSemSenha = usuario.toJSON();
        delete usuarioSemSenha.senha;

        return res.status(200).json({
            mensagem: "Perfil atualizado com sucesso.",
            usuario: usuarioSemSenha
        });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}

export async function deleteConta(req, res) {
    try {
        const usuario = await User.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        usuario.ativo = false;
        await usuario.save();

        return res.status(200).json({
            mensagem: "Conta desativada com sucesso."
        });
    } catch (error) {
        console.error("Erro ao desativar conta:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}