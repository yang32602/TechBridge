import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import { useAuth } from "../hooks/useAuth";
import ApiService from "../services/api";

const Header = () => {
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (
        isAuthenticated &&
        user &&
        user.id &&
        (!user.realName ||
          user.name === "Estudiante" ||
          user.name === "Empresa")
      ) {
        try {
          let userDetails = null;
          if (user.userType === "postulantes") {
            userDetails = await ApiService.getStudentByUserId(user.id);
            if (userDetails) {
              updateUser({
                realName: userDetails.nombre_completo,
                name: userDetails.nombre_completo,
              });
            }
          } else if (user.userType === "empresas") {
            userDetails = await ApiService.getCompanyByUserId(user.id);
            if (userDetails) {
              updateUser({
                realName: userDetails.nombre,
                name: userDetails.nombre,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, user, updateUser]);

  const handleLogout = () => {
    logout();
  };

  const handleAvatarClick = () => {
    // Navigate to profile page based on user type
    if (user?.userType === "empresas") {
      navigate("/profile-company");
    } else {
      navigate("/profile-student");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const cleanName = name.replace(/^(Estudiante|Empresa)$/i, "Usuario");
    return cleanName
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.realName) return user.realName;
    if (user?.name && !["Estudiante", "Empresa"].includes(user.name)) {
      return user.name;
    }
    return user?.userType === "postulantes" ? "Estudiante" : "Empresa";
  };

  const getGreetingName = () => {
    const displayName = getDisplayName();
    if (displayName && !["Estudiante", "Empresa"].includes(displayName)) {
      const firstName = displayName.split(" ")[0];
      return `Hola, ${firstName}`;
    }
    return displayName;
  };

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
          {isAuthenticated ? (
            <div className="user-menu">
              <div
                className="user-avatar clickable"
                onClick={handleAvatarClick}
                title="Ver perfil"
              >
                {getInitials(getDisplayName())}
              </div>
              <span className="user-name">{getGreetingName()}</span>
              <button
                onClick={handleLogout}
                className="btn btn-text logout-btn"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-text">
                Iniciar Sesión
              </Link>
              <div className="divider"></div>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
