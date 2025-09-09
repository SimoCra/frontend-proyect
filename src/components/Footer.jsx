import React from 'react';
import '../styles/components/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Sección del Logo */}
        <div className="footer-section">
          <img 
            src="/img/Logo.png" 
            alt="Logo Santoral Sagrado" 
            className="footer-logo" 
          />
        </div>

        {/* Sección de Ayuda */}
        <div className="footer-section">
          <h4 className="footer-help-header">Obtener ayuda</h4>
          <ul className="footer-help-list">
            <li><a href="#">Servicio al cliente</a></li>
            <li><a href="#">Devoluciones</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
        </div>

        {/* Sección de Redes Sociales */}
        <div className="footer-section footer-social">
          <a href="httpswa://wa.me/573012960651" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        {/* Información de Contacto */}
        <div className="footer-bottom-info">
          <p className="location-text">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Colombia
          </p>
          <p>© Santoral Sagrado | NIT: 21.196.0834-1 | Edificio la Ceiba Local 101 Piso 11</p>
          <p>Todos los derechos reservados</p>
          <p>santoralsagrado@gmail.com / +57 3012960651</p>
        </div>

        {/* Enlaces de Políticas */}
        <div className="footer-bottom-links">
          <a href="#">Términos de uso</a>
          <a href="#">Políticas de devolución</a>
          <a href="#">Políticas de privacidad</a>
          <a href="#">Términos de venta</a>
        </div>

        {/* Logo SIC */}
        <div className="footer-bottom-sic">
          <img 
            src="/img/IDS.png" 
            alt="Logo Superintendencia de Industria y Comercio"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;