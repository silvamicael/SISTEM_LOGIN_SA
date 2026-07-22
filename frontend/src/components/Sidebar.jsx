function Sidebar({ pagina, setPagina }) {
    const itens = [
        { id: "dashboard", label: "Início" },
        { id: "trilhas", label: "Trilhas" },
        { id: "planos", label: "Plano" },
        { id: "avaliacao", label: "Avaliação" },
        { id: "perfil", label: "Perfil" }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-badge">E</div>
                <div>
                    <h2>EduSphere IA</h2>
                    <p>Aprendizagem adaptativa</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {itens.map((item) => (
                    <button
                        key={item.id}
                        className={pagina === item.id ? "active" : ""}
                        onClick={() => setPagina(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>Sistema educacional guiado por IA</p>
            </div>
        </aside>
    );
}

export default Sidebar;