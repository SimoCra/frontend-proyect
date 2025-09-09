import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';
import '../../styles/public_css/Register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    validatePassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, email, password, validatePassword, phone } = form;

  if (password !== validatePassword) {
    return setError("Las contraseñas no coinciden");
  }

  const payload = { name, email, password, phone, validatePassword };

  try {
    await register(payload);
    setForm({ name: '', email: '', phone: '', password: '', validatePassword: '' });
    setError('');

    Swal.fire({
      icon: "success",
      title: "Cuenta creada correctamente",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      navigate('/login');
    });
  } catch (error) {
    setError(error.message || 'Error al crear usuario');
  }
};


  return (
    <div className="register-wrapper">
  {/* Logo a la izquierda */}
  <div className="logo-section">
    <img src="/img/Logo.png" alt="Santoral Sagrado" className="logo-img" />
  </div>

  {/* Formulario de registro */}
  <form onSubmit={handleSubmit} className="register-box">
    <h2>Registro</h2>

    <input
      type="text"
      name="name"
      placeholder="Nombre"
      value={form.name}
      onChange={handleChange}
    />

    <input
      type="email"
      name="email"
      placeholder="Correo electrónico"
      value={form.email}
      onChange={handleChange}
    />

    <input
      type="text"
      name="phone"
      placeholder="Número celular"
      value={form.phone}
      onChange={handleChange}
    />

    <input
      type="password"
      name="password"
      placeholder="Contraseña"
      value={form.password}
      onChange={handleChange}
    />

    <input
      type="password"
      name="validatePassword"
      placeholder="Confirmar contraseña"
      value={form.validatePassword}
      onChange={handleChange}
    />

    <button type="submit">Crea tu cuenta</button>

    {error && <p className="register-error">{error}</p>}
  </form>
</div>

  );
};

export default Register;
