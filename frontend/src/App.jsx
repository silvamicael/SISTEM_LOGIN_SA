import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch("/usuario/perfil")
            .then(() => setLogado(true))
            .catch(() => setLogado(false))
            .finally(() => setVerificandoSessao(false));
    }, []);

    useEffect(() => {
        function handleAuthLogout() {
            setLogado(false);
            navigate("/dashboard");
        }

        window.addEventListener("auth:logout", handleAuthLogout);

        return () => window.removeEventListener("auth:logout", handleAuthLogout);
    }, [navigate]);

    async function logout() {
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } catch {
            setLogado(false);
        }

        setLogado(false);
        navigate("/dashboard");
    }

    if (verificandoSessao) {
        return <div className="app-loading">Carregando...</div>;
    }

    if (!logado) {
        return <Auth onAuthSuccess={() => setLogado(true)} />;
    }

    return (
        <div className="layout">
            <Sidebar />

            <div className="content">
                <Navbar onLogout={logout} />

                <main className="page">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/trilhas" element={<Trilhas />} />
                        <Route path="/planos" element={<Planos />} />
                        <Route path="/avaliacao" element={<Avaliacao />} />
                        <Route path="/perfil" element={<Perfil onContaDesativada={logout} />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
