import jwt from "jsonwebtoken";

const UM_DIA_MS = 24 * 60 * 60 * 1000;
const isProducao = process.env.NODE_ENV === "production";

export const NOME_COOKIE_TOKEN = "token";

export function gerarToken(usuario) {
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

export function opcoesCookieToken() {
    return {
        httpOnly: true,
        secure: isProducao,
        sameSite: isProducao ? "none" : "lax",
        maxAge: UM_DIA_MS
    };
}

export function definirCookieToken(res, token) {
    res.cookie(NOME_COOKIE_TOKEN, token, opcoesCookieToken());
}

export function limparCookieToken(res) {
    const { maxAge, ...opcoes } = opcoesCookieToken();
    res.clearCookie(NOME_COOKIE_TOKEN, opcoes);
}
