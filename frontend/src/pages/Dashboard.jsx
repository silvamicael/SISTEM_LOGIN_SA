import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import {
    LuUserRound,
    LuShieldCheck,
    LuFolder,
    LuChartColumn,
    LuBot,
    LuFlag,
    LuClipboardList
} from "react-icons/lu";

function Dashboard() {
    const [usuario, setUsuario] = useState(null);
    const [planos, setPlanos] = useState([]);
    const [minhaTrilha, setMinhaTrilha] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function carregarDados() {
            try {
                const [perfil, listaPlanos, trilhaData] = await Promise.all([
                    apiFetch("/usuario/perfil"),
                    apiFetch("/plans"),
                    apiFetch("/trilhas/minha").catch(() => ({ trilha: null }))
                ]);

                if (cancelado) {
                    return;
                }

                setUsuario(perfil);
                setPlanos(Array.isArray(listaPlanos) ? listaPlanos : []);
                setMinhaTrilha(trilhaData?.trilha || null);
            } catch (error) {
                if (!cancelado) {
                    setErro(error.message);
                }
            }
        }

        carregarDados();

        return () => {
            cancelado = true;
        };
    }, []);

    const primeiroNome = usuario?.nome?.split(" ")[0] || "Aluno";

    return (
        <div className="page-content">
            <section className="hero-panel">
                <div>
                    <span className="hero-tag">Painel inteligente</span>
                    <h1>Olá, {primeiroNome} 👋</h1>
                    <p>
                        Acompanhe sua trilha, seu plano de estudo e a evolução
                        do seu aprendizado em um só lugar.
                    </p>
                </div>

                <div className="hero-side-card">
                    <span className="illustration-icon illustration-icon-blue">
                        <LuBot size={40} />
                    </span>
                    <h3>Mentoria personalizada</h3>
                    <p>
                        Sua plataforma usa IA para sugerir trilhas, avaliações e
                        planos adaptados ao seu objetivo.
                    </p>
                </div>
            </section>

            {erro && <p className="msg error">{erro}</p>}

            <div className="dashboard-grid">
                <div className="dashboard-card glass-card">
                    <span className="stat-icon stat-icon-blue">
                        <LuUserRound size={20} />
                    </span>
                    <span className="card-label">Usuário</span>
                    <strong>{usuario?.nome || "-"}</strong>
                    <small>{usuario?.email || "-"}</small>
                </div>

                <div className="dashboard-card glass-card">
                    <span className="stat-icon stat-icon-green">
                        <LuShieldCheck size={20} />
                    </span>
                    <span className="card-label">Status</span>
                    <strong>{usuario?.ativo ? "Ativo" : "Inativo"}</strong>
                    <small>Conta verificada</small>
                </div>

                <div className="dashboard-card glass-card">
                    <span className="stat-icon stat-icon-blue">
                        <LuFolder size={20} />
                    </span>
                    <span className="card-label">Planos</span>
                    <strong>{planos.length}</strong>
                    <small>Plano(s) registrado(s)</small>
                </div>

                <div className="dashboard-card glass-card">
                    <span className="stat-icon stat-icon-purple">
                        <LuChartColumn size={20} />
                    </span>
                    <span className="card-label">Nível atual</span>
                    <strong>{usuario?.nivelObjetivo || "intermediario"}</strong>
                    <small>Nível de conhecimento</small>
                </div>
            </div>

            <div className="dashboard-sections">
                <section className="card dark-card">
                    <h3>Sua trilha atual</h3>

                    {!minhaTrilha ? (
                        <div className="empty-state">
                            <span className="illustration-icon illustration-icon-blue">
                                <LuFlag size={36} />
                            </span>
                            <p>Nenhuma trilha escolhida ainda.</p>
                            <span>
                                Vá até a aba de Trilhas para gerar opções com a
                                Gemini.
                            </span>
                        </div>
                    ) : (
                        <div className="trail-summary">
                            <div>
                                <strong>{minhaTrilha.titulo}</strong>
                                <p>{minhaTrilha.descricao}</p>
                            </div>

                            <div className="trail-badges">
                                <span>{minhaTrilha.nivelAtual}</span>
                                <span>{minhaTrilha.nivelObjetivo}</span>
                            </div>
                        </div>
                    )}
                </section>

                <section className="card dark-card">
                    <h3>Próximo passo</h3>
                    <div className="empty-state">
                        <span className="illustration-icon illustration-icon-blue">
                            <LuClipboardList size={36} />
                        </span>
                        <p>Gere uma avaliação diagnóstica.</p>
                        <span>
                            Depois da trilha escolhida, a plataforma monta uma
                            avaliação inicial e sugere um plano de estudo.
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;