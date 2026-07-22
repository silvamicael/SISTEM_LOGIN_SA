import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Planos() {
    const [planos, setPlanos] = useState([]);
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [avaliacaoPendente, setAvaliacaoPendente] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarPlanos();
    }, []);

    async function carregarPlanos() {
        try {
            const data = await apiFetch("/plans");
            setPlanos(Array.isArray(data) ? data : []);
        } catch (error) {
            setErro(error.message);
        }
    }

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
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
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
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
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

                    <div className="questions-list">
                        {avaliacaoPendente.perguntas.map((pergunta) => (
                            <div className="question-card" key={pergunta.id}>
                                <p className="question-title">{pergunta.enunciado}</p>

                                <div className="alternativas">
                                    {pergunta.alternativas.map((alternativa) => (
                                        <label key={alternativa} className="alternativa-item">
                                            <input
                                                type="radio"
                                                name={`progress-${pergunta.id}`}
                                                value={alternativa}
                                                checked={respostas[pergunta.id] === alternativa}
                                                onChange={() =>
                                                    marcarResposta(pergunta.id, alternativa)
                                                }
                                            />
                                            <span>{alternativa}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

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