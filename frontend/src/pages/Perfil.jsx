import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useAsyncAction } from "../hooks/useAsyncAction";

function Perfil({ onContaDesativada }) {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        novaSenha: "",
        confirmarNovaSenha: ""
    });
    const { mensagem, erro, carregando, executar, setMensagem, setErro } = useAsyncAction();

    useEffect(() => {
        let cancelado = false;

        async function carregarPerfil() {
            try {
                const dados = await apiFetch("/usuario/perfil");

                if (cancelado) {
                    return;
                }

                setForm((prev) => ({
                    ...prev,
                    nome: dados.nome || "",
                    email: dados.email || ""
                }));
            } catch (error) {
                if (!cancelado) {
                    setErro(error.message);
                }
            }
        }

        carregarPerfil();

        return () => {
            cancelado = true;
        };
    }, [setErro]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function atualizarPerfil(event) {
        event.preventDefault();

        await executar(async () => {
            const payload = {
                nome: form.nome,
                email: form.email
            };

            if (form.novaSenha) {
                payload.novaSenha = form.novaSenha;
                payload.confirmarNovaSenha = form.confirmarNovaSenha;
            }

            const resposta = await apiFetch("/usuario/perfil", {
                method: "PUT",
                body: JSON.stringify(payload)
            });

            setMensagem(resposta.mensagem || "Perfil atualizado com sucesso.");
            setForm((prev) => ({
                ...prev,
                novaSenha: "",
                confirmarNovaSenha: ""
            }));
        });
    }

    async function desativarConta() {
        const confirmar = window.confirm(
            "Tem certeza que deseja desativar sua conta?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await apiFetch("/usuario/conta", {
                method: "DELETE"
            });

            await onContaDesativada();
        } catch (error) {
            setErro(error.message);
        }
    }

    const inicial = form.nome ? form.nome.charAt(0).toUpperCase() : "?";

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Perfil</h1>
                    <p>Atualize seus dados pessoais e sua senha.</p>
                </div>
            </div>

            <div className="card profile-card">
                <div className="profile-header">
                    <div className="avatar">{inicial}</div>

                    <div className="profile-info">
                        <h3>{form.nome || "Usuário"}</h3>
                        <span>{form.email || "sem e-mail"}</span>
                    </div>
                </div>

                <form onSubmit={atualizarPerfil}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="novaSenha">Nova senha</label>
                        <input
                            id="novaSenha"
                            name="novaSenha"
                            type="password"
                            value={form.novaSenha}
                            onChange={handleChange}
                            placeholder="Preencha só se quiser alterar"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarNovaSenha">
                            Confirmar nova senha
                        </label>
                        <input
                            id="confirmarNovaSenha"
                            name="confirmarNovaSenha"
                            type="password"
                            value={form.confirmarNovaSenha}
                            onChange={handleChange}
                            placeholder="Confirme a nova senha"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={carregando}>
                            {carregando ? "Salvando..." : "Salvar alterações"}
                        </button>

                        <button
                            className="danger"
                            type="button"
                            onClick={desativarConta}
                        >
                            Desativar conta
                        </button>
                    </div>
                </form>

                {mensagem && <p className="msg success">{mensagem}</p>}
                {erro && <p className="msg error">{erro}</p>}
            </div>
        </div>
    );
}

export default Perfil;