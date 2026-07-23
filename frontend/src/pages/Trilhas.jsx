import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useAsyncAction } from "../hooks/useAsyncAction";

function Trilhas() {
    const [form, setForm] = useState({
        areaInteresse: "",
        nivelAtual: "iniciante",
        nivelObjetivo: "intermediario"
    });

    const [opcoes, setOpcoes] = useState([]);
    const [minhaTrilha, setMinhaTrilha] = useState(null);
    const { mensagem, erro, carregando, executar, setMensagem, setErro } = useAsyncAction();

    useEffect(() => {
        let cancelado = false;

        async function carregarMinhaTrilha() {
            try {
                const data = await apiFetch("/trilhas/minha");

                if (!cancelado) {
                    setMinhaTrilha(data.trilha || null);
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        carregarMinhaTrilha();

        return () => {
            cancelado = true;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function gerarOpcoes(event) {
        event.preventDefault();

        await executar(async () => {
            const data = await apiFetch("/trilhas/gerar-opcoes", {
                method: "POST",
                body: JSON.stringify(form)
            });

            setOpcoes(data.opcoes || []);
            setMensagem("A Gemini gerou novas trilhas para você.");
        });
    }

    async function escolherTrilha(trilha) {
        setMensagem("");
        setErro("");

        try {
            const data = await apiFetch("/trilhas/escolher", {
                method: "POST",
                body: JSON.stringify(trilha)
            });

            setMinhaTrilha(data.trilha);
            setMensagem("Trilha escolhida com sucesso.");
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <span className="hero-tag">Planejamento guiado</span>
                    <h1>Trilhas personalizadas</h1>
                    <p>
                        Conte para a IA onde você está e aonde quer chegar. Ela
                        monta opções de estudo adaptadas ao seu perfil.
                    </p>
                </div>
            </div>

            <section className="card dark-card">
                <h3>Gerar trilhas com IA</h3>

                <form onSubmit={gerarOpcoes}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="areaInteresse">Área de interesse</label>
                            <input
                                id="areaInteresse"
                                name="areaInteresse"
                                value={form.areaInteresse}
                                onChange={handleChange}
                                placeholder="Ex: JavaScript, Banco de Dados, Redes..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivelAtual">Onde estou</label>
                            <select
                                id="nivelAtual"
                                name="nivelAtual"
                                value={form.nivelAtual}
                                onChange={handleChange}
                            >
                                <option value="iniciante">Iniciante</option>
                                <option value="intermediario">Intermediário</option>
                                <option value="avancado">Avançado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivelObjetivo">Onde quero chegar</label>
                            <select
                                id="nivelObjetivo"
                                name="nivelObjetivo"
                                value={form.nivelObjetivo}
                                onChange={handleChange}
                            >
                                <option value="iniciante">Iniciante</option>
                                <option value="intermediario">Intermediário</option>
                                <option value="avancado">Avançado</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={carregando}>
                        {carregando ? "Gerando..." : "Gerar opções"}
                    </button>
                </form>

                {mensagem && <p className="msg success">{mensagem}</p>}
                {erro && <p className="msg error">{erro}</p>}
            </section>

            {minhaTrilha && (
                <section className="card highlight-card">
                    <div className="card-topline">
                        <span className="card-label">Trilha ativa</span>
                    </div>

                    <h3>{minhaTrilha.titulo}</h3>
                    <p>{minhaTrilha.descricao}</p>

                    <div className="trail-badges">
                        <span>Atual: {minhaTrilha.nivelAtual}</span>
                        <span>Objetivo: {minhaTrilha.nivelObjetivo}</span>
                    </div>
                </section>
            )}

            <section className="cards-grid">
                {opcoes.length === 0 ? (
                    <div className="card dark-card empty-card">
                        <h3>Nenhuma opção gerada ainda</h3>
                        <p>
                            Preencha os dados acima para a Gemini sugerir
                            trilhas personalizadas.
                        </p>
                    </div>
                ) : (
                    opcoes.map((trilha, index) => (
                        <div className="card dark-card trail-card" key={index}>
                            <div className="card-topline">
                                <span className="card-label">
                                    Opção {index + 1}
                                </span>
                            </div>

                            <h3>{trilha.titulo}</h3>
                            <p>{trilha.descricao}</p>

                            <div className="trail-badges">
                                <span>{trilha.nivelAtual}</span>
                                <span>{trilha.nivelObjetivo}</span>
                            </div>

                            <div className="trail-section">
                                <strong>Tópicos</strong>
                                <ul>
                                    {(trilha.topicos || []).map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="trail-section">
                                <strong>Habilidades</strong>
                                <ul>
                                    {(trilha.habilidades || []).map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <button type="button" onClick={() => escolherTrilha(trilha)}>
                                Escolher trilha
                            </button>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default Trilhas;