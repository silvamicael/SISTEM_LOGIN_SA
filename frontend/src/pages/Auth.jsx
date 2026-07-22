import { useState } from "react";
import { apiFetch } from "../services/api";

function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: ""
    });
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
            if (!isLogin && form.senha !== form.confirmarSenha) {
                throw new Error("As senhas não coincidem.");
            }

            if (isLogin) {
                const data = await apiFetch("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email: form.email,
                        senha: form.senha
                    })
                });

                localStorage.setItem("token", data.token);
                onAuthSuccess();
                return;
            }

            await apiFetch("/auth/cadastro", {
                method: "POST",
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    confirmarSenha: form.confirmarSenha
                })
            });

            setMensagem("Conta criada com sucesso. Faça login para continuar.");
            setIsLogin(true);
            setForm({
                nome: "",
                email: "",
                senha: "",
                confirmarSenha: ""
            });
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-panel">
                <div className="auth-brand">
                    <h1>Edu IA</h1>
                    <p>
                        Plataforma web de aprendizagem adaptativa com foco em
                        personalização do ensino.
                    </p>
                </div>

                <div className="auth-box">
                    <div className="auth-header">
                        <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>
                        <p>
                            {isLogin
                                ? "Acesse sua conta para continuar."
                                : "Cadastre-se para começar a usar a plataforma."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="nome">Nome</label>
                                <input
                                    id="nome"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="seuemail@gmail.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                value={form.senha}
                                onChange={handleChange}
                                placeholder="Digite sua senha"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmarSenha">
                                    Confirmar senha
                                </label>
                                <input
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    type="password"
                                    value={form.confirmarSenha}
                                    onChange={handleChange}
                                    placeholder="Digite novamente a senha"
                                    required
                                />
                            </div>
                        )}

                        <button className="auth-btn" type="submit" disabled={carregando}>
                            {carregando
                                ? "Carregando..."
                                : isLogin
                                ? "Entrar"
                                : "Cadastrar"}
                        </button>
                    </form>

                    <div className="switch-auth">
                        {isLogin ? (
                            <p>
                                Não tem conta?{" "}
                                <span onClick={() => setIsLogin(false)}>
                                    Criar agora
                                </span>
                            </p>
                        ) : (
                            <p>
                                Já tem conta?{" "}
                                <span onClick={() => setIsLogin(true)}>
                                    Fazer login
                                </span>
                            </p>
                        )}
                    </div>

                    {mensagem && <p className="msg success">{mensagem}</p>}
                    {erro && <p className="msg error">{erro}</p>}
                </div>
            </div>
        </div>
    );
}

export default Auth;