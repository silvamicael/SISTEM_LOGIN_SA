import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },

        perfil: {
            type: DataTypes.ENUM("ALUNO", "ADMIN"),
            allowNull: false,
            defaultValue: "ALUNO"
        },

        trilhaId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        nivelAtual: {
            type: DataTypes.ENUM("iniciante", "intermediario", "avancado"),
            allowNull: false,
            defaultValue: "iniciante"
        },

        nivelObjetivo: {
            type: DataTypes.ENUM("iniciante", "intermediario", "avancado"),
            allowNull: false,
            defaultValue: "intermediario"
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "usuarios",
        timestamps: true
    }
);

export default User;