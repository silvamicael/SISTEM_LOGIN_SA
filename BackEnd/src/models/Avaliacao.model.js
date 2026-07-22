import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

export const Avaliacao = sequelize.define(
    "Avaliacao",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        planoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        tipo: {
            type: DataTypes.ENUM("diagnostica", "progresso"),
            allowNull: false
        },

        perguntas: {
            type: DataTypes.JSON,
            allowNull: false
        },

        respostasAluno: {
            type: DataTypes.JSON,
            allowNull: true
        },

        nota: {
            type: DataTypes.FLOAT,
            allowNull: true
        },

        nivelClassificado: {
            type: DataTypes.STRING,
            allowNull: true
        },

        dificuldade: {
            type: DataTypes.STRING,
            allowNull: true
        },

        feedback: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pendente"
        }
    },
    {
        tableName: "avaliacoes",
        timestamps: true
    }
);

export default Avaliacao;