import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src={logoImage} alt="TechBridge" className="logo-icon" />
        </Link>

        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            Postulantes
          </a>
          <a href="#" className="nav-item">
            Vacantes
          </a>
          <a href="#" className="nav-item">
            Comunidad
          </a>
          <a href="#" className="nav-item">
            Contacto
          </a>
        </nav>

        <div className="header-buttons">
          <Link to="/login" className="btn btn-text">
            Iniciar Sesión
          </Link>
          <div className="divider"></div>
          <Link to="/register" className="btn btn-primary">
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
