import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Avaliacao() {
    const [trilhas, setTrilhas] = useState([]);
    const [trilhaSelecionada, setTrilhaSelecionada] = useState("");
    const [avaliacaoAtual, setAvaliacaoAtual] = useState(null);
    const [planoId, setPlanoId] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarTrilhas();
    }, []);

    async function carregarTrilhas() {
        try {
            const data = await apiFetch("/trilhas");
            setTrilhas(Array.isArray(data) ? data : []);
        } catch (error) {
            setErro(error.message);
        }
    }

    async function gerarDiagnostico() {
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
            if (!trilhaSelecionada) {
                throw new Error("Escolha uma trilha primeiro.");
            }

            const trilha = trilhas.find((item) => String(item.id) === String(trilhaSelecionada));

            const data = await apiFetch("/plans/diagnostic", {
                method: "POST",
                body: JSON.stringify({
                    trilha: trilha.titulo
                })
            });

            setPlanoId(data.planoId);
            setAvaliacaoAtual(data.perguntas);
            setRespostas({});
            setMensagem("Avaliação diagnóstica gerada com sucesso.");
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    function marcarResposta(perguntaId, alternativa) {
        setRespostas((prev) => ({
            ...prev,
            [perguntaId]: alternativa
        }));
    }

    async function enviarDiagnostico() {
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
            const payload = Object.entries(respostas).map(([id, respostaEscolhida]) => ({
                id: Number(id),
                respostaEscolhida
            }));

            const data = await apiFetch(`/plans/${planoId}/diagnostic/submit`, {
                method: "POST",
                body: JSON.stringify({
                    respostas: payload
                })
            });

            setMensagem(
                `Diagnóstico enviado com sucesso. Nota: ${data.nota} | Nível: ${data.nivel}`
            );
            setAvaliacaoAtual(null);
            setRespostas({});
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
                    <h1>Avaliação</h1>
                    <p>Gere uma avaliação diagnóstica com base na trilha escolhida.</p>
                </div>
            </div>

            <section className="card">
                <h3>Gerar avaliação diagnóstica</h3>

                <div className="form-group">
                    <label htmlFor="trilhaSelecionada">Escolha uma trilha</label>
                    <select
                        id="trilhaSelecionada"
                        value={trilhaSelecionada}
                        onChange={(event) => setTrilhaSelecionada(event.target.value)}
                    >
                        <option value="">Selecione</option>
                        {trilhas.map((trilha) => (
                            <option key={trilha.id} value={trilha.id}>
                                {trilha.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={gerarDiagnostico} disabled={carregando}>
                    {carregando ? "Gerando..." : "Gerar diagnóstico"}
                </button>

                {mensagem && <p className="msg success">{mensagem}</p>}
                {erro && <p className="msg error">{erro}</p>}
            </section>

            {avaliacaoAtual && (
                <section className="card">
                    <h3>Responder avaliação</h3>

                    <div className="questions-list">
                        {avaliacaoAtual.map((pergunta) => (
                            <div className="question-card" key={pergunta.id}>
                                <p className="question-title">{pergunta.enunciado}</p>

                                <div className="alternativas">
                                    {pergunta.alternativas.map((alternativa) => (
                                        <label key={alternativa} className="alternativa-item">
                                            <input
                                                type="radio"
                                                name={`pergunta-${pergunta.id}`}
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

                    <button onClick={enviarDiagnostico} disabled={carregando}>
                        {carregando ? "Enviando..." : "Enviar respostas"}
                    </button>
                </section>
            )}
        </div>
    );
}

export default Avaliacao;