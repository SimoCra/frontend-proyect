import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import '../../styles/public_css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) return setError('Completa el captcha');
    try {
      await login(email.trim(), password.trim(), captchaToken);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retrySeconds = error.response.data?.retry_after_seconds || 0;
        const minutes = Math.ceil(retrySeconds / 60);
        setError(`Demasiados intentos. Espera ${minutes} minuto(s).`);
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
    }
  };

  const handleRegister = () => navigate('/register');

   const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      return Swal.fire({
        title: 'Campo vacío',
        text: 'Por favor ingresa un correo válido.',
        icon: 'warning',
        customClass: { popup: 'swal-rounded' }
      });
    }

    Swal.fire({
      title: 'Enviando código...',
      html: `<div class="loader"></div>
      <style>
        .loader {
          display: block;
          --height-of-loader: 4px;
          --loader-color: #0071e2;
          width: 130px;
          height: var(--height-of-loader);
          border-radius: 30px;
          background-color: rgba(0,0,0,0.2);
          position: relative;
          margin: 20px auto 0;
        }
        .loader::before {
          content: "";
          position: absolute;
          background: var(--loader-color);
          top: 0;
          left: 0;
          width: 0%;
          height: 100%;
          border-radius: 30px;
          animation: moving 1s ease-in-out infinite;
        }
        @keyframes moving {
          50% { width: 100%; }
          100% { width: 0; right: 0; left: unset; }
        }
      </style>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    try {
  const msg = await forgotPassword(forgotEmail.trim());

  await Swal.fire({
    title: 'Código enviado',
    text: msg,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    customClass: { popup: 'swal-rounded' }
  });

  // ✅ Ya no redirige
  setShowForgotModal(false); // opcional: cerrar modal si quieres

} catch (err) {
  Swal.fire({
    title: 'Error',
    text: err.message,
    icon: 'error',
    timer: 2000,
  });
}

  };

  // ... resto del componente igual
;

  return (
    <div className="login-wrapper">
      <div className="logo-section">
        <img src="/img/Logo.png" alt="Santoral Sagrado" className="logo-img" />
      </div>

      <form onSubmit={handleSubmit} className="login-box">
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Correo electrónico o número de teléfono"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

       <div className="recaptcha-container">
        <ReCAPTCHA
          sitekey="6LeD7osrAAAAAHJWCbln3kLGjozdKhHQlGGRZcvS"
          onChange={token => setCaptchaToken(token)}
        />
      </div>

        <button type="submit">Iniciar sesión</button>

        {error && <p className="error">{error}</p>}

        <p className="forgot" onClick={() => setShowForgotModal(true)}>
          ¿Olvidaste tu contraseña?
        </p>

        <hr />

        <button type="button" className="register-btn" onClick={handleRegister}>
          Crea tu cuenta
        </button>
      </form>

      {showForgotModal && (
  <div
    className="modal-overlay"
    onClick={(e) => {
      if (e.target.classList.contains('modal-overlay')) {
        setShowForgotModal(false);
      }
    }}
  >
    <div className="modal-content forgot-modal">
      <div className="forgot-left">
        <h3>Recuperar<br />contraseña</h3>
        <p>simon castañeda</p>
      </div>

      <div className="forgot-right">
        <img src="/img/Logo.png" alt="Santoral" className="forgot-logo" />
        <input
          type="text"
          placeholder="Correo electrónico o Número de celular"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
        <div className="forgot-buttons">
          <button onClick={handleForgotPassword}>Enviar código</button>
          <button className="modal-close" onClick={() => {
            setShowForgotModal(false);
            setForgotEmail('');
          }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Login;
