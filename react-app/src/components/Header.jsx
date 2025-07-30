import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import { useAuth } from "../hooks/useAuth";
import ApiService from "../services/api";
import { getInitials, getAvatarStyles } from "../utils/avatarUtils";

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
            userDetails = await ApiService.getCompanyByUserId(user.id_empresa || user.id);
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
    navigate("/");
  };

  const handleAvatarClick = () => {
    // Navigate to profile page based on user type
    if (user?.userType === "empresas") {
      navigate("/empresa-perfil");
    } else {
      navigate("/profile-student");
    }
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
          <Link to='/' className="nav-item">
            Inicio
          </Link>
          <Link to="/postulantes" className="nav-item">
            Postulantes
          </Link>
          <Link to="/vacantes" className="nav-item">
            Vacantes
          </Link>         
          <Link to="/contacto" className="nav-item">
            Contacto
          </Link>
        </nav>

        <div className="header-buttons">
          {isAuthenticated ? (
            <div className="user-menu">
              <div
                className="user-avatar clickable"
                onClick={handleAvatarClick}
                title="Ver perfil"
                style={{
                  ...getAvatarStyles(getDisplayName(), 40),
                  cursor: "pointer"
                }}
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
