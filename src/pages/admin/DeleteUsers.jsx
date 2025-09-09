import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { fetchAllUsers, deleteUserById } from '../../services/userService';
import UserCard from '../../components/UserCard';
import '../../styles/admin_css/DeleteUsers.css';

const DeleteUser = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 25; // 🔹 usuarios por página

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers(page, limit);
        setUsers(data.users);
      } catch (err) {
        setError('Error al obtener usuarios: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [page]);

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro que quieres eliminar este usuario?')) return;
    try {
      await deleteUserById(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="users-panel">
      <h1>Usuarios Registrados</h1>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Buscar por correo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="users-panel__search"
      />

      <div className="users-panel__grid">
        {users
          .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
          .map((u) => (
            <UserCard
              key={u.id}
              userItem={u}
              currentUserId={user.id}
              onDelete={handleDelete}
            />
          ))}
      </div>

      <div className="users-panel__pagination">
  {/* Botón Anterior solo aparece si no estamos en la página 1 */}
  {page > 1 && (
    <button onClick={() => setPage((prev) => prev - 1)}>
      ⬅ Anterior
    </button>
  )}

  <span>Página {page}</span>

  {/* Botón Siguiente solo aparece si todavía hay más usuarios */}
  {users.length === limit && (
    <button onClick={() => setPage((prev) => prev + 1)}>
      Siguiente ➡
    </button>
  )}
</div>
    </div>
  );
};

export default DeleteUser;
