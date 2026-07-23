import jwt from "jsonwebtoken";
import { NOME_COOKIE_TOKEN } from "../utils/token.js";

function extrairToken(req) {
    const tokenDoCookie = req.cookies?.[NOME_COOKIE_TOKEN];

    if (tokenDoCookie) {
        return tokenDoCookie;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    const [tipo, token] = authHeader.split(" ");

    return tipo === "Bearer" ? token : null;
}

export function authJWT(req, res, next) {
    try {
        const token = extrairToken(req);

        if (!token) {
            return res.status(401).json({
                erro: "Token não informado."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id: decoded.id,
            perfil: decoded.perfil
        };

        return next();
    } catch (error) {
        console.error("Erro na autenticação JWT:", error);

        return res.status(401).json({
            erro: "Token expirado ou inválido."
        });
    }
}