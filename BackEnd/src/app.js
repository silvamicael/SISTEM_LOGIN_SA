import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import corsConfig from "./config/cors.js";
import sequelize from "./config/database.js";
import { helmetConfig } from "./config/helmet.js";
import { limitadorGlobal } from "./config/rateLimit.js";
import { errorHandler } from "./middleware/error.middleware.js";

import "./models/index.js";

import routerAuth from "./router/auth.routes.js";
import routerUser from "./router/user.routes.js";
import routerPlano from "./router/plano.routes.js";
import routerTrilha from "./router/trilha.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const isProducao = process.env.NODE_ENV === "production";

app.use(cors(corsConfig));
app.use(helmetConfig);
app.use(limitadorGlobal);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(isProducao ? "combined" : "dev"));

app.get("/", (req, res) => {
    return res.status(200).json({
        mensagem: "API funcionando."
    });
});

app.use("/auth", routerAuth);
app.use("/usuario", routerUser);
app.use("/plans", routerPlano);
app.use("/trilhas", routerTrilha);

app.use(errorHandler);

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("Banco conectado com sucesso.");

        await sequelize.sync({ alter: true });
        console.log("Banco sincronizado com sucesso.");

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
}

iniciarServidor();