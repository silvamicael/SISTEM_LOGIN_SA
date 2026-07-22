import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

export const Plano = sequelize.define(
    "Plano",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        trilha: {
            type: DataTypes.STRING,
            allowNull: false
        },

        nivel: {
            type: DataTypes.STRING,
            allowNull: true
        },

        conteudosPrioritarios: {
            type: DataTypes.JSON,
            allowNull: true
        },

        metas: {
            type: DataTypes.JSON,
            allowNull: true
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pendente"
        }
    },
    {
        tableName: "planos",
        timestamps: true
    }
);

export default Plano;