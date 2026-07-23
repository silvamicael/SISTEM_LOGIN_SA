import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useAsyncAction } from "../hooks/useAsyncAction";
import QuestionForm from "../components/QuestionForm";

function Avaliacao() {
    const [trilhas, setTrilhas] = useState([]);
    const [trilhaSelecionada, setTrilhaSelecionada] = useState("");
    const [avaliacaoAtual, setAvaliacaoAtual] = useState(null);
    const [planoId, setPlanoId] = useState(null);
    const [respostas, setRespostas] = useState({});
    const { mensagem, erro, carregando, executar, setMensagem, setErro } = useAsyncAction();

    useEffect(() => {
        let cancelado = false;

        async function carregarTrilhas() {
            try {
                const data = await apiFetch("/trilhas");

                if (!cancelado) {
                    setTrilhas(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(error.message);
                }
            }
        }

        carregarTrilhas();

        return () => {
            cancelado = true;
        };
    }, [setErro]);

    async function gerarDiagnostico() {
        await executar(async () => {
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
        });
    }

    function marcarResposta(perguntaId, alternativa) {
        setRespostas((prev) => ({
            ...prev,
            [perguntaId]: alternativa
        }));
    }

    async function enviarDiagnostico() {
        await executar(async () => {
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
        });
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

                    <QuestionForm
                        perguntas={avaliacaoAtual}
                        respostas={respostas}
                        onResponder={marcarResposta}
                        namePrefix="pergunta"
                    />

                    <button onClick={enviarDiagnostico} disabled={carregando}>
                        {carregando ? "Enviando..." : "Enviar respostas"}
                    </button>
                </section>
            )}
        </div>
    );
}

export default Avaliacao;