import { NavLink } from "react-router-dom";
import { LuHouse, LuNetwork, LuCalendar, LuClipboardCheck, LuUserRound, LuBrain } from "react-icons/lu";

function Sidebar() {
    const itens = [
        { to: "/dashboard", label: "Início", Icon: LuHouse },
        { to: "/trilhas", label: "Trilhas", Icon: LuNetwork },
        { to: "/planos", label: "Plano", Icon: LuCalendar },
        { to: "/avaliacao", label: "Avaliação", Icon: LuClipboardCheck },
        { to: "/perfil", label: "Perfil", Icon: LuUserRound }
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {itens.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-promo">
                    <LuBrain size={22} />
                    <p>A IA que entende seu ritmo e te leva mais longe.</p>
                </div>

                <div className="sidebar-footer">
                    <p>Sistema educacional guiado por IA</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
