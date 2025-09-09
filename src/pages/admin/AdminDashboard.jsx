import { useEffect, useState, useContext } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AuthContext from '../../context/AuthContext';
import '../../styles/admin_css/AdminDashBoard.css';

const COLORS = ['#60a5fa', '#10b981', '#facc15', '#f472b6', '#c084fc'];

const AdminDashboard = () => {
  const { getDataDashboard } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDataDashboard();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Error al cargar estadísticas');
      }
    };
    fetchStats();
  }, [getDataDashboard]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!stats) return <p>Cargando estadísticas...</p>;

  // Asegurarse de que los valores de "count" en la gráfica circular sean números
  const topProducts = stats.top_cart_products.map(item => ({
    ...item,
    count: Number(item.count),
  }));

  return (
    <div className="dashboard-container">

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Usuarios</h3>
          <p>{stats.total_users}</p>
        </div>
        <div className="dashboard-card">
          <h3>Usuarios Nuevos Hoy</h3>
          <p>{stats.new_users_today}</p>
        </div>
        <div className="dashboard-card">
          <h3>Productos Totales</h3>
          <p>{stats.total_products}</p>
        </div>
        <div className="dashboard-card">
          <h3>Productos en Carrito</h3>
          <p>{stats.total_cart_items}</p>
        </div>
      </div>

      <div className="dashboard-graphs">
        <div className="dashboard-graph">
          <h3>Usuarios Nuevos por Día</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.users_per_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-graph">
          <h3>Top Productos en Carrito</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="count"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {topProducts.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
