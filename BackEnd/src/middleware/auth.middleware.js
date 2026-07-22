import jwt from "jsonwebtoken";

export function authJWT(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                erro: "Token não informado."
            });
        }

        const [tipo, token] = authHeader.split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                erro: "Token inválido."
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