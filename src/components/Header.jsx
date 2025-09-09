import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationsContext";
import { FiBell } from "react-icons/fi";
import "../styles/components/Header.css";
import SearchBar from "./SearchBar"; // 👈 importamos el buscador separado

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const {
    notifications,
    loadNotifications,
    loading,
    error,
    markAllAsRead,
  } = useNotifications();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCart = () => navigate("/cart-buy");

  const toggleNotifications = async () => {
    const willShow = !showNotificationsPanel;
    setShowNotificationsPanel(willShow);

    if (willShow && user?.id) {
      // 🔹 Siempre recargamos las notificaciones al abrir
      await loadNotifications(user.id);

      // 🔹 Se marcan como leídas solo al abrir el panel
      if (notifications.some((n) => !n.is_read)) {
        await markAllAsRead();
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="home__header">
      {/* Logo */}
      <div className="home__logo-container">
        <img src="/img/Logo.png" alt="Santoral" className="home__logo" />
      </div>

      {/* Centro (Búsqueda y Categorías de Escritorio) */}
      <div className="home__center">
        <SearchBar /> {/* 👈 buscador separado */}
        <nav className="home__categorias">
          <Link to="/">Inicio</Link>
          <Link to="/products">Productos</Link>
          <Link to="/about">Nosotros</Link>
          <Link to="/contact">Contáctanos</Link>
        </nav>
      </div>

      {/* Íconos y Acciones a la Derecha */}
      <div className="home__icons">
        {user ? (
          <>
            {/* Notificaciones */}
            <div
              className="home__notifications-container"
              onClick={toggleNotifications}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <FiBell size={24} color="#000" />
              {unreadCount > 0 && (
                <span className="home__notifications-badge">
                  {unreadCount}
                </span>
              )}

              {showNotificationsPanel && (
                <div className="home__notifications-panel">
                  {loading && <p>Cargando notificaciones...</p>}
                  {error && <p className="error">{error}</p>}
                  {!loading && !error && notifications.length === 0 && (
                    <p>No tienes notificaciones</p>
                  )}
                  {!loading && !error && notifications.length > 0 && (
                    <ul>
                      {notifications.map((notif) => (
                        <li
                          key={notif.id}
                          className={`notification-item ${
                            notif.is_read ? "" : "unread"
                          }`}
                        >
                          <strong>{notif.title}</strong>
                          <p>{notif.message}</p>
                          <small>
                            {new Date(notif.created_at).toLocaleString()}
                          </small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="home__profile-container">
              <img
                src="/img/usuario-de-perfil.png"
                alt="Usuario"
                className="home__icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <div className="home__profile-panel">
                  <div className="home__profile-header">
                    <img
                      src={`http://localhost:5000/${
                        user.file_path || "uploads/default.jpg"
                      }`}
                      alt="Foto de perfil"
                      className="home__profile-avatar"
                      crossOrigin="anonymous"
                    />
                    <div className="home__profile-info">
                      <h3>{user.username || "Usuario"}</h3>
                    </div>
                  </div>
                  <div className="home__profile-actions">
                    <Link to="/account" className="home__edit-btn">
                      Mi cuenta
                    </Link>
                    <Link to="/my-orders" className="home__edit-btn">
                      Mis pedidos
                    </Link>
                    <Link to="/notifications" className="home__edit-btn">
                      Notificaciones
                    </Link>
                    <button className="home__logout-btn" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Carrito */}
            <div className="home__cart-container" onClick={handleCart}>
              <img
                src="/img/carrito-de-compras.png"
                alt="Carrito"
                className="home__icon"
              />
              {cartItems?.length > 0 && (
                <span className="home__cart-badge">{cartItems.length}</span>
              )}
            </div>
          </>
        ) : (
          <div className="home__login-buttons">
            <Link to="/login" className="home__login-btn">
              Iniciar sesión
            </Link>
          </div>
        )}

        {/* Ícono de Hamburguesa (visible en móvil gracias a CSS) */}
        <div className="home__hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      {/* Menú desplegable para móvil */}
      {isMenuOpen && (
        <nav className="home__categorias-mobile">
          <Link to="/" onClick={toggleMenu}>
            Inicio
          </Link>
          <Link to="/products" onClick={toggleMenu}>
            Productos
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            Nosotros
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contáctanos
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
