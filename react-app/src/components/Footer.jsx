import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/">
            <img src={logoImage} alt="TechBridge" className="footer-logo-img" />
          </Link>
          <p className="footer-description">
            TechBridge: "Conexión entre talento y empresa"
          </p>
        </div>

        <div className="footer-section">
          <h4>Navegacion</h4>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Postulantes
            </a>
            <a href="#" className="footer-link">
              Vacantes
            </a>
            <a href="#" className="footer-link">
              Contactenos
            </a>
            <a href="#" className="footer-link">
              Comunidad
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Terminos de servicios
            </a>
            <a href="#" className="footer-link">
              Politica de privacidad
            </a>
            <a href="#" className="footer-link">
              Politica de cookies
            </a>
          </div>
        </div>

        <div className="newsletter">
          <h4>Recibe notificaciones</h4>
          <p className="newsletter-description">
            Ingresa tu email y recibe notificaciones de Techbridge
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Email Address"
              className="newsletter-input"
            />
            <button className="btn btn-primary">Suscribirse</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          2024vbvv @ Techbridge. Todos los derechos reservados
        </p>
        <div className="social-links">
          <a href="#" className="social-link">
            📘
          </a>
          <a href="#" className="social-link">
            📷
          </a>
          <a href="#" className="social-link">
            🌐
          </a>
          <a href="#" className="social-link">
            💼
          </a>
          <a href="#" className="social-link">
            🐦
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
