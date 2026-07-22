import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Trilha = sequelize.define(
    "Trilha",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        topicos: {
            type: DataTypes.JSON,
            allowNull: true
        },
        habilidades: {
            type: DataTypes.JSON,
            allowNull: true
        },
        areaInteresse: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nivelAtual: {
            type: DataTypes.ENUM("iniciante", "intermediario", "avancado"),
            allowNull: true
        },
        nivelObjetivo: {
            type: DataTypes.ENUM("iniciante", "intermediario", "avancado"),
            allowNull: true
        },
        origem: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "gemini"
        },
        ativa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "trilhas",
        timestamps: true
    }
);

export default Trilha;