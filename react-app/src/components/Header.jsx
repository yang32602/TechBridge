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
          <Link to='/' className="nav-item">
            Inicio
          </Link>
          <Link to="/postulantes" className="nav-item">
            Postulantes
          </Link>
          <Link to="/vacantes" className="nav-item">
            Vacantes
          </Link>
          <Link to="/comunidad" className="nav-item">
            Comunidad
          </Link>
          <Link to="/contacto" className="nav-item">
            Contacto
          </Link>
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
