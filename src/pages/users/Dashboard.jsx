import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/users_css/DashBoard.css";

const Dashboard = () => {
  const { user, logout, editUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(user.id, form.email, form.name, form.phone);
      alert("✅ Datos actualizados correctamente");
      window.location.reload();
    } catch (error) {
      alert("❌ Error al actualizar: " + error.message);
    }
  };

  return (
    <div className="account-container">
      <h1 className="account-title">Mi cuenta</h1>

      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div
            className={`side-block ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Información personal
          </div>
          <div
            className={`side-block ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            Direcciones
          </div>
        </aside>

        {/* Panel principal */}
        <section className="account-panel">
          <div className="panel-inner">
            {activeTab === "info" && (
              <form onSubmit={handleSubmit} className="account-form">
                <div className="field">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Teléfono:</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="action-row">
                  <button type="submit" className="btn-black">
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn-outline"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </form>
            )}

            {activeTab === "addresses" && (
              <div className="addresses-section">
                <p className="placeholder-text">
                  📍 Aquí se mostrarán tus direcciones registradas.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
