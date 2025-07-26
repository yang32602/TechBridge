import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";
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
            <Link to="/postulantes" className="footer-link">
              Postulantes
            </Link>
            <Link to="/vacantes" className="footer-link">
              Vacantes
            </Link>
            <Link to="/contacto" className="footer-link">
              Contactenos
            </Link>
            <Link to="/comunidad" className="footer-link">
              Comunidad
            </Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/terminos" className="footer-link">
              Términos de servicios
            </Link>
            <Link to="/privacidad" className="footer-link">
              Política de privacidad
            </Link>
            <Link to="/cookies" className="footer-link">
              Política de cookies
            </Link>
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
        <div className="social-links" style={{ display: "flex", gap: "10px" }}>
          <a
            href="https://www.facebook.com/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#3b5998" }}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#E1306C" }}
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#1DA1F2" }}
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.tiktok.com/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#000000" }}
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
