import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/users_css/UserOrders.css";

const UserOrders = () => {
  const { getMyOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Error al cargar tus pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getMyOrders]);

  if (loading) return <p className="uo-loading">Cargando tus pedidos...</p>;
  if (error) return <p className="uo-error">{error}</p>;

  const formatCurrency = (amount) => {
    if (isNaN(Number(amount))) return "$0.00";
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "Fecha inválida";
    return date.toLocaleDateString();
  };

  return (
    <div className="uo-container">
      <h2 className="uo-title">Mis pedidos</h2>

      {orders.length === 0 ? (
        <p className="uo-empty">No tienes pedidos aún</p>
      ) : (
        <div className="uo-table-wrapper">
          <table className="uo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="uo-id">#{order.id}</span>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td className="uo-total">
                    ${formatCurrency(order.total)}
                  </td>
                  <td>
                    <span
                      className={`uo-status uo-status-${order.status?.toLowerCase() || "unknown"}`}
                    >
                      {order.status || "Desconocido"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="uo-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>
    </div>
  );
};

export default UserOrders;
