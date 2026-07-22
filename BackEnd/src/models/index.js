import User from "./User.model.js";
import Trilha from "./Trilha.model.js";
import Plano from "./Plano.model.js";
import Avaliacao from "./Avaliacao.model.js";

Trilha.hasMany(User, {
    foreignKey: "trilhaId",
    as: "usuarios"
});

User.belongsTo(Trilha, {
    foreignKey: "trilhaId",
    as: "trilha"
});

User.hasMany(Plano, {
    foreignKey: "usuarioId",
    as: "planos"
});

Plano.belongsTo(User, {
    foreignKey: "usuarioId",
    as: "usuario"
});

Plano.hasMany(Avaliacao, {
    foreignKey: "planoId",
    as: "avaliacoes"
});

Avaliacao.belongsTo(Plano, {
    foreignKey: "planoId",
    as: "plano"
});

export {
    User,
    Trilha,
    Plano,
    Avaliacao
};