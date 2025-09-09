import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin_css/EditOrdersUsers.css";

const STATUS_OPTIONS = [
  "pendiente",
  "enviado",
  "entregado"
];

const EditOrdersUsers = () => {
  const { getAllOrders, updateOrderStatus } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      const data = res.orders || [];
      const sorted = data.sort(
        (a, b) => new Date(b.order_created_at) - new Date(a.order_created_at)
      );

      setOrders(sorted);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return isNaN(date) ? "Fecha inválida" : date.toLocaleString();
  };

  const handleStatusChange = async (orderId, newStatus, userId) => {
    setError(null);
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus, userId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      setError("No se pudo actualizar el estado del pedido");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) return <p className="loading">Cargando pedidos...</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Pedidos de Usuarios</h2>
      {error && <p className="error-message">{error}</p>}
      {orders.length === 0 ? (
        <p className="no-orders">No hay pedidos</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{order.user_email}</td>
                <td>{order.full_address || "Sin dirección"}</td>
                <td className="products-cell">
                  {order.products?.split(" | ").map((product, index) => (
                    <span key={index} className="product-item">
                      {product}
                    </span>
                  )) || "Sin productos"}
                </td>
                <td className="price">
                  ${Number(order.total || 0).toLocaleString()}
                </td>
                <td>{formatDate(order.order_created_at)}</td>
                <td>
                  {order.status === "cancelado" ? (
                    <span className="status cancelled">Cancelado</span>
                  ) : (
                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.order_id}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value, order.user_id)
                      }
                      className={`status-select ${order.status.toLowerCase()}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                  {updatingOrderId === order.order_id && (
                    <span className="updating-text">Actualizando...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditOrdersUsers;
