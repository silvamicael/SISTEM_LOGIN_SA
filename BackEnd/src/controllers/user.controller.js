import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export async function getPerfil(req, res) {
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
}

export async function updatePerfil(req, res) {
    const { nome, email, novaSenha } = req.body;

    const usuario = await User.findByPk(req.usuario.id);

    if (!usuario) {
        return res.status(404).json({
            erro: "Usuário não encontrado."
        });
    }

    if (nome !== undefined) {
        usuario.nome = nome;
    }

    if (email !== undefined) {
        const emailExistente = await User.findOne({
            where: { email }
        });

        if (emailExistente && emailExistente.id !== usuario.id) {
            return res.status(409).json({
                erro: "E-mail já cadastrado."
            });
        }

        usuario.email = email;
    }

    if (novaSenha) {
        usuario.senha = await bcrypt.hash(novaSenha, 10);
    }

    await usuario.save();

    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    return res.status(200).json({
        mensagem: "Perfil atualizado com sucesso.",
        usuario: usuarioSemSenha
    });
}

export async function deleteConta(req, res) {
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
}
