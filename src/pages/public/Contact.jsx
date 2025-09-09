import React, { useState } from "react";
import "../../styles/public_css/Contact.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaMobileAlt, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { useContacts } from "../../context/ContactContext";
import Swal from "sweetalert2"; // 👈 importar SweetAlert2
import withReactContent from "sweetalert2-react-content"; // 👈 para React-friendly

const MySwal = withReactContent(Swal);

const Contact = () => {
  const { addContactRequest } = useContacts();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addContactRequest(
        `${formData.name} ${formData.lastName}`,
        formData.email,
        formData.subject,
        formData.message
      );

      // ✅ SweetAlert de éxito animado
      MySwal.fire({
        title: "¡Solicitud enviada!",
        text: "Gracias por contactarnos. Te responderemos lo antes posible.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
        toast: false,
        customClass: {
          popup: "swal2-animate-success", // animación personalizada
        },
      });

      setFormData({
        name: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      // ❌ SweetAlert de error
      MySwal.fire({
        title: "Error",
        text: err.message || "Hubo un problema al enviar tu solicitud. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-page">
        <h1 className="page-title">CONTACTANOS</h1>

        <div className="contact-container">
          {/* Columna Izquierda: Formulario */}
          <div className="contact-card contact-form-container">
            <h2>Contactanos</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group-inline">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el motivo</option>
                  <option value="consulta">Consulta general</option>
                  <option value="informacion">Información de productos</option>
                  <option value="pedido">Problemas con el pedido</option>
                  <option value="devolucion">Solicitud de devolución/cambio</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="reclamo">Queja / Reclamo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Escriba su mensaje..."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Enviando..." : "Enviar tu mensaje"}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Información */}
          <div className="contact-card contact-info-container">
            <div className="info-section">
              <h3>Ubicación</h3>
              <p>
                Calle 52 #47-28
                <br />
                Medellín, Colombia
              </p>
            </div>

            <div className="info-section">
              <FaMobileAlt size={35} className="info-icon" />
              <p>+57 300 821 48 91</p>
            </div>

            <div className="info-section">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a
                  href="https://wa.me/573008214891"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={35} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={35} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={35} />
                </a>
              </div>
            </div>

            <p className="privacy-policy">2025 Política de privacidad</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
