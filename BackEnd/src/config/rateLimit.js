import rateLimit from 'express-rate-limit';

// ========= Configurações Globais =========
export const limitadorGlobal = rateLimit({
    windowMs: 15*60*1000, // Janela de tempo para fazer algo
    max: 300, // Número máximo de requisições por IP
    statusCode: 429,
    message: {
        erro: 'Muitas requisições por minuto',
    },
    standardHeaders: true, // Envia RateLimit-* nos headers
    legacyHeaders: false, // Desativa o X-RateLimit-* antigo
    skip: (req) => req.method === "OPTIONS" // Preflight de CORS não conta como requisição real
});

// ========= Configurações Anti-Spawn =========
export const limitadorGetUser = rateLimit({
    windowMs: 15*60*1000,
    max: 60,
    statusCode: 429,
    message: {
        erro: 'Muitas requisições por minuto',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS"
});