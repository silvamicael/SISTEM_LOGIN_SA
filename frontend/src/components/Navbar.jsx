function Navbar({ onLogout }) {
    return (
        <header className="navbar">
            <div>
                <h3>Painel do Usuário</h3>
                <span className="navbar-subtitle">
                    Plataforma de Aprendizagem Adaptativa com IA
                </span>
            </div>

            <button className="logout-button" onClick={onLogout}>
                Sair
            </button>
        </header>
    );
}

export default Navbar;