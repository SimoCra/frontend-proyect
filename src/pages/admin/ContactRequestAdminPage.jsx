import React from "react";
import { useContacts } from "../../context/ContactContext";
import "../../styles/admin_css/ContactRequestAdminPage.css";

const ContactRequestsAdminPage = () => {
  const {
    requests,
    loading,
    error,
    page,
    totalPages,
    loadContactRequests,
    changeContactRequestStatus,
    removeContactRequest,
  } = useContacts();

  const handleStatusChange = async (id, status) => {
    try {
      await changeContactRequestStatus(id, status);
    } catch (err) {
      console.error("❌ Error cambiando estado:", err);
      alert(err.message || "Error al actualizar estado");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta solicitud?")) {
      try {
        await removeContactRequest(id);
      } catch (err) {
        console.error("❌ Error eliminando solicitud:", err);
        alert(err.message || "Error al eliminar solicitud");
      }
    }
  };

  const handlePrevPage = async () => {
    if (page > 1) {
      await loadContactRequests(page - 1);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages) {
      await loadContactRequests(page + 1);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!requests.length) return <p>No hay solicitudes de contacto.</p>;

  return (
    <div className="contact-requests-container">
      <h2>Solicitudes de Contacto</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Asunto</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.subject}</td>
              <td>{req.message}</td>
              <td>
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(req.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <button disabled={page === 1} onClick={handlePrevPage}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={handleNextPage}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ContactRequestsAdminPage;
