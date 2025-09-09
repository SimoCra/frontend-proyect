import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin_css/AdminPanel.css";

// Íconos
import {
  FiHome,
  FiUsers,
  FiBox,
  FiGrid,
  FiShoppingBag,
  FiBell,
  FiMail,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  // Menú dinámico
  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, action: () => navigate("/admin/dashboard-stats") },
    { name: "Usuarios", icon: <FiUsers />, action: () => navigate("/admin/users") },
    { name: "Crear Productos", icon: <FiBox />, action: () => navigate("/admin/create-product") },
    { name: "Categorías", icon: <FiGrid />, action: () => navigate("/admin/categories") },
    { name: "Pedidos", icon: <FiShoppingBag />, action: () => navigate("/admin/orders-users") },
    { name: "Notificaciones", icon: <FiBell />, action: () => navigate("/admin/global-notification") },
    { name: "Solicitudes de Contacto", icon: <FiMail />, action: () => navigate("/admin/contact-requests") },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div>
        {/* Toggle Sidebar */}
        <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>

        {/* Perfil */}
        <div className="admin-sidebar-profile">
          <img
            src={`http://localhost:5000/${user?.image || "uploads/default.jpg"}`}
            alt="Perfil"
            crossOrigin="anonymous"
          />
          {isOpen && <h2>{user?.name}</h2>}
        </div>

        {/* Navegación */}
        <nav className="admin-sidebar-nav">
          {menuItems.map((item, index) => (
            <button key={index} onClick={item.action}>
              <span className="icon">{item.icon}</span>
              {isOpen && item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="admin-sidebar-logout">
        <button onClick={logout}>
          <FiLogOut className="icon" />
          {isOpen && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
};

export default AdminPanel;
