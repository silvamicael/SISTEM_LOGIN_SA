import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

function gerarToken(usuario) {
    return jwt.sign(
        {
            id: usuario.id,
            perfil: usuario.perfil
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
}

export async function createUser(req, res) {
    try {
        const { nome, email, senha, confirmarSenha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, e-mail e senha são obrigatórios."
            });
        }

        if (nome.trim().length < 3) {
            return res.status(400).json({
                erro: "O nome deve ter no mínimo 3 caracteres."
            });
        }

        const emailNormalizado = normalizarEmail(email);

        if (!emailTemDominioValido(emailNormalizado)) {
            return res.status(400).json({
                erro: "Informe um e-mail válido com domínio conhecido."
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                erro: "A senha deve ter no mínimo 8 caracteres."
            });
        }

        if (confirmarSenha !== undefined && senha !== confirmarSenha) {
            return res.status(400).json({
                erro: "A confirmação de senha não confere."
            });
        }

        const usuarioExistente = await User.findOne({
            where: {
                email: emailNormalizado
            }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                erro: "E-mail já cadastrado."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await User.create({
            nome: nome.trim(),
            email: emailNormalizado,
            senha: senhaCriptografada,
            perfil: "ALUNO"
        });

        const usuarioSemSenha = usuario.toJSON();
        delete usuarioSemSenha.senha;

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso.",
            usuario: usuarioSemSenha
        });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "E-mail e senha são obrigatórios."
            });
        }

        const emailNormalizado = normalizarEmail(email);

        if (!emailTemDominioValido(emailNormalizado)) {
            return res.status(400).json({
                erro: "Informe um e-mail válido."
            });
        }

        const usuario = await User.findOne({
            where: {
                email: emailNormalizado
            }
        });

        if (!usuario || !usuario.ativo) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        const token = gerarToken(usuario);

        const usuarioSemSenha = usuario.toJSON();
        delete usuarioSemSenha.senha;

        return res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: usuarioSemSenha
        });
    } catch (error) {
        console.error("Erro ao realizar login:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
}