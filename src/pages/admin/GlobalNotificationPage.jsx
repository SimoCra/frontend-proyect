import React, { useState } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { useNotifications } from "../../context/NotificationsContext";
import "../../styles/admin_css/GlobalNotificationPage.css";

const iconMap = {
  order: <FiShoppingCart size={24} color="#2563eb" />,
  user: <FiUser size={24} color="#10b981" />,
  alert: <FiAlertCircle size={24} color="#dc2626" />,
  info: <FiInfo size={24} color="#3b82f6" />,
};

const GlobalNotificationsPage = () => {
  const { notifications, loading, error, addGlobalNotification } =
    useNotifications();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGlobalNotification(title, message, type);
      setTitle("");
      setMessage("");
      setType("info");
      setShowModal(false);
    } catch (err) {
      console.error("❌ Error creando notificación:", err);
    }
  };

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <h2>Panel Notificaciones</h2>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          Crear Notificación
        </button>
      </div>

      <hr />

      {/* Estado de carga o error */}
      {loading && <p>Cargando notificaciones...</p>}
      {error && <p className="error">{error}</p>}

      {/* Lista de notificaciones */}
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const icon =
              iconMap[notif.type?.toLowerCase()] || iconMap["info"];

            return (
              <div key={notif.id} className="notification-item">
                <div className="notification-icon">{icon}</div>
                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          !loading && <p className="no-notifications">No hay notificaciones</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Crear Notificación Global</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Título:
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label>
                Mensaje:
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>

              <label>
                Tipo:
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="info">Info</option>
                  <option value="alert">Alerta</option>
                  <option value="order">Orden</option>
                  <option value="user">Usuario</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNotificationsPage;
