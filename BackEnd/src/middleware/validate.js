export function validate(schema) {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            const mensagem = resultado.error.issues[0]?.message || "Dados inválidos.";

            return res.status(400).json({
                erro: mensagem
            });
        }

        req.body = resultado.data;
        return next();
    };
}
