import { useState } from "react";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Trilhas from "./pages/Trilhas";
import Avaliacao from "./pages/Avaliacao";
import Planos from "./pages/Planos";
import "./styles.css";

function App() {
    const [logado, setLogado] = useState(!!localStorage.getItem("token"));
    const [pagina, setPagina] = useState("dashboard");

    function logout() {
        localStorage.removeItem("token");
        setLogado(false);
        setPagina("dashboard");
    }

    function renderPagina() {
        switch (pagina) {
            case "perfil":
                return <Perfil />;
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