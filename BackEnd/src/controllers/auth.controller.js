import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { definirCookieToken, gerarToken, limparCookieToken } from "../utils/token.js";

export async function createUser(req, res) {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await User.findOne({
        where: { email }
    });

    if (usuarioExistente) {
        return res.status(409).json({
            erro: "E-mail já cadastrado."
        });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await User.create({
        nome,
        email,
        senha: senhaCriptografada,
        perfil: "ALUNO"
    });

    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    return res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso.",
        usuario: usuarioSemSenha
    });
}

export async function login(req, res) {
    const { email, senha } = req.body;

    const usuario = await User.findOne({
        where: { email }
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
    definirCookieToken(res, token);

    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    return res.status(200).json({
        mensagem: "Login realizado com sucesso.",
        usuario: usuarioSemSenha
    });
}

export async function logout(req, res) {
    limparCookieToken(res);

    return res.status(200).json({
        mensagem: "Logout realizado com sucesso."
    });
}
