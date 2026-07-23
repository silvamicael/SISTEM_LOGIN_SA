export function errorHandler(error, req, res, next) {
    console.error("Erro não tratado:", error);

    const status = error.status || 500;
    const mensagem = status < 500
        ? error.message
        : "Erro interno do servidor.";

    return res.status(status).json({
        erro: mensagem
    });
}
