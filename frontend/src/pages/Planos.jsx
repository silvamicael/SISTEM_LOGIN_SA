import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useAsyncAction } from "../hooks/useAsyncAction";
import QuestionForm from "../components/QuestionForm";

function Planos() {
    const [planos, setPlanos] = useState([]);
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [avaliacaoPendente, setAvaliacaoPendente] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [respostas, setRespostas] = useState({});
    const { mensagem, erro, carregando, executar, setMensagem, setErro } = useAsyncAction();

    useEffect(() => {
        let cancelado = false;

        async function carregarPlanos() {
            try {
                const data = await apiFetch("/plans");

                if (!cancelado) {
                    setPlanos(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(error.message);
                }
            }
        }

        carregarPlanos();

        return () => {
            cancelado = true;
        };
    }, [setErro]);

    async function abrirPlano(id) {
        setMensagem("");
        setErro("");

        try {
            const plano = await apiFetch(`/plans/${id}`);
            const progresso = await apiFetch(`/plans/${id}/progress`);

            setPlanoSelecionado(plano);
            setAvaliacaoPendente(progresso.avaliacaoPendente || null);
            setHistorico(progresso.historico || []);
            setRespostas({});
        } catch (error) {
            setErro(error.message);
        }
    }

    function marcarResposta(perguntaId, alternativa) {
        setRespostas((prev) => ({
            ...prev,
            [perguntaId]: alternativa
        }));
    }

    async function enviarProgresso() {
        await executar(async () => {
            const payload = Object.entries(respostas).map(([id, respostaEscolhida]) => ({
                id: Number(id),
                respostaEscolhida
            }));

            const data = await apiFetch(`/plans/${planoSelecionado.id}/progress/submit`, {
                method: "POST",
                body: JSON.stringify({
                    respostas: payload
                })
            });

            setMensagem(`Avaliação enviada. Nota: ${data.nota}`);
            await abrirPlano(planoSelecionado.id);
        });
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Planos</h1>
                    <p>Visualize seus planos e acompanhe a evolução.</p>
                </div>
            </div>

            {mensagem && <p className="msg success">{mensagem}</p>}
            {erro && <p className="msg error">{erro}</p>}

            <section className="card">
                <h3>Meus planos</h3>

                {planos.length === 0 ? (
                    <p className="empty-text">Nenhum plano encontrado.</p>
                ) : (
                    <div className="plans-list">
                        {planos.map((plano) => (
                            <div className="plan-item" key={plano.id}>
                                <div>
                                    <strong>{plano.trilha}</strong>
                                    <p>Nível: {plano.nivel || "não definido"}</p>
                                    <p>Status: {plano.status}</p>
                                </div>

                                <button onClick={() => abrirPlano(plano.id)}>
                                    Abrir
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {planoSelecionado && (
                <section className="card">
                    <h3>Detalhes do plano</h3>

                    <div className="info-list">
                        <p><strong>Trilha:</strong> {planoSelecionado.trilha}</p>
                        <p><strong>Nível:</strong> {planoSelecionado.nivel || "-"}</p>
                        <p><strong>Status:</strong> {planoSelecionado.status}</p>
                    </div>

                    <div className="info-list" style={{ marginTop: "16px" }}>
                        <p><strong>Conteúdos prioritários:</strong></p>
                        <ul>
                            {(planoSelecionado.conteudosPrioritarios || []).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="info-list" style={{ marginTop: "16px" }}>
                        <p><strong>Metas:</strong></p>
                        <ul>
                            {(planoSelecionado.metas || []).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {avaliacaoPendente && (
                <section className="card">
                    <h3>Avaliação de progresso</h3>
                    <p><strong>Dificuldade:</strong> {avaliacaoPendente.dificuldade}</p>

                    <QuestionForm
                        perguntas={avaliacaoPendente.perguntas}
                        respostas={respostas}
                        onResponder={marcarResposta}
                        namePrefix="progress"
                    />

                    <button onClick={enviarProgresso} disabled={carregando}>
                        {carregando ? "Enviando..." : "Enviar avaliação"}
                    </button>
                </section>
            )}

            {historico.length > 0 && (
                <section className="card">
                    <h3>Histórico</h3>

                    <div className="plans-list">
                        {historico.map((item) => (
                            <div className="plan-item" key={item.id}>
                                <div>
                                    <strong>Nota: {item.nota}</strong>
                                    <p>Dificuldade: {item.dificuldade || "-"}</p>
                                    <p>{item.feedback || "Sem feedback."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Planos;