import rateLimit from 'express-rate-limit';

// ========= Configurações Globais =========
export const limitadorGlobal = rateLimit({
    windowMs: 15*60*1000, // Janela de tempo para fazer algo
    max: 100, // Número máximo de requisições por IP
    statusCode: 429, 
    message: {
        erro: 'Muitas requisições por minuto',
    },
    standardHeaders: true, // Envia RateLimit-* nos headers
    legacyHeaders: false // Desativa o X-RateLimit-* antigo
});

// ========= Configurações Anti-Spawn =========
export const limitadorGetUser = rateLimit({
    windowMs: 15*60*1000,
    max: 10,
    statusCode: 429,
    message: {
        erro: 'Muitas requisições por minuto',
    },
    standardHeaders: true,
    legacyHeaders: false
});