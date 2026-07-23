import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Trilhas from "./pages/Trilhas";
import Avaliacao from "./pages/Avaliacao";
import Planos from "./pages/Planos";
import { apiFetch } from "./services/api";
import "./styles.css";

function App() {
    const [logado, setLogado] = useState(false);
    const [verificandoSessao, setVerificandoSessao] = useState(true);
    const [pagina, setPagina] = useState("dashboard");

    useEffect(() => {
        apiFetch("/usuario/perfil")
            .then(() => setLogado(true))
            .catch(() => setLogado(false))
            .finally(() => setVerificandoSessao(false));
    }, []);

    useEffect(() => {
        function handleAuthLogout() {
            setLogado(false);
            setPagina("dashboard");
        }

        window.addEventListener("auth:logout", handleAuthLogout);

        return () => window.removeEventListener("auth:logout", handleAuthLogout);
    }, []);

    async function logout() {
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } catch {
            setLogado(false);
        }

        setLogado(false);
        setPagina("dashboard");
    }

    function renderPagina() {
        switch (pagina) {
            case "perfil":
                return <Perfil onContaDesativada={logout} />;
            case "trilhas":
                return <Trilhas />;
            case "avaliacao":
                return <Avaliacao />;
            case "planos":
                return <Planos />;
            case "dashboard":
            default:
                return <Dashboard />;
        }
    }

    if (verificandoSessao) {
        return <div className="app-loading">Carregando...</div>;
    }

    if (!logado) {
        return <Auth onAuthSuccess={() => setLogado(true)} />;
    }

    return (
        <div className="layout">
            <Sidebar pagina={pagina} setPagina={setPagina} />

            <div className="content">
                <Navbar onLogout={logout} />

                <main className="page">
                    {renderPagina()}
                </main>
            </div>
        </div>
    );
}

export default App;
