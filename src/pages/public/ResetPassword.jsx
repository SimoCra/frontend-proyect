// ======================= IMPORTS ======================= //
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { useAuth } from "../../context/AuthContext";

// ======================= COMPONENT ======================= //
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyTokenPassword, resetPassword } = useAuth();

  // Extraer token desde la URL
  const token = decodeURIComponent(
    location.pathname.replace("/reset-password/", "")
  );

  // Estados de validación
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Estados del formulario
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // ======================= VALIDAR TOKEN ======================= //
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setErrorMessage("El enlace no contiene un token válido.");
      setLoading(false);
      return;
    }

    verifyTokenPassword(token)
      .then(() => {
        setTokenValid(true);
        setErrorMessage("");
      })
      .catch((err) => {
        setTokenValid(false);
        setErrorMessage(err.message || "El enlace es inválido o ha expirado.");
      })
      .finally(() => setLoading(false));
  }, [token, verifyTokenPassword]);

  // ======================= HANDLERS ======================= //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Por favor completa ambos campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoadingAction(true); // inicia loader

      // Llamada a la API
      await resetPassword(token, password, confirmPassword);

      // Éxito
      setSuccess("¡Contraseña actualizada! Serás redirigido al login...");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Error al actualizar la contraseña");
    } finally {
      setLoadingAction(false); // detiene loader
    }
  };

  const handleSolicitarNuevo = () => navigate("/login");

  // ======================= RENDER ======================= //
  if (loading) return <p>Cargando...</p>;

  if (!tokenValid) {
    return (
      <div>
        <h2>Enlace inválido o expirado</h2>
        <p>{errorMessage}</p>
        <button onClick={handleSolicitarNuevo}>Solicitar nuevo enlace</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Cambiar contraseña</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva contraseña:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loadingAction}
          />
        </div>

        <div>
          <label>Confirmar contraseña:</label>
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loadingAction}
          />
        </div>

        <button type="submit" disabled={loadingAction}>
          {loadingAction ? "Cargando..." : "Actualizar contraseña"}
        </button>
      </form>

      {loadingAction && (
        <div style={{ marginTop: "1rem" }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 50 50"
            style={{ display: "block", margin: "auto" }}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#007BFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
              transform="rotate(-90 25 25)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
