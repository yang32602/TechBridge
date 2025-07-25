import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HiHome,
  HiChat,
  HiOfficeBuilding,
  HiUsers,
  HiBriefcase,
  HiCog,
  HiQuestionMarkCircle,
  HiLogout,
  HiCurrencyDollar,
} from "react-icons/hi";
import logoImage from "../assets/Logo.png";
import "../assets/sidebar-common.css";
import "../assets/styles.css";

const CompanySidebar = ({ activeSection = "dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile-company");
  };

  const getInitials = (nombreCompleto) => {
    if (!nombreCompleto) return "U";
    const parts = nombreCompleto.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
    const secondInitial = parts[1]?.charAt(0).toUpperCase() || "";
    return firstInitial + secondInitial || "U";
  };

  // Generate random avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "#0a5cb8", // Project blue
      "#1e40af", // Blue 700
      "#059669", // Emerald 600
      "#dc2626", // Red 600
      "#7c3aed", // Violet 600
      "#ea580c", // Orange 600
      "#0891b2", // Cyan 600
      "#65a30d", // Lime 600
    ];

    const index = name?.length ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const companyName = user?.realName || user?.name || "Empresa";
  const userEmail = user?.email || "empresa@email.com";

  const mainMenuItems = [
    {
      id: "dashboard",
      icon: HiHome,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      id: "messages",
      icon: HiChat,
      label: "Mensajes",
      onClick: () => { },
      badge: 1,
    },
    {
      id: "company-profile",
      icon: HiOfficeBuilding,
      label: "Perfil de empresa",
      onClick: handleProfileClick,
    },
    {
      id: "job-posts",
      icon: HiBriefcase,
      label: "Postulaciones",
      onClick: () => navigate("/postulaciones"),
    },
    {
      id: "comprar-puntos",
      icon: HiCurrencyDollar,
      label: "Comprar Puntos",
      onClick: () => navigate("/comprar-puntos"),
    },
  ];

  const supportItems = [
    {
      id: "contact",
      icon: HiCog,
      label: "Contáctanos",
      onClick: () => { },
    },
    {
      id: "help",
      icon: HiQuestionMarkCircle,
      label: "Centro de Ayuda",
      onClick: () => { },
    },
  ];

  return (
    <aside className="company-sidebar">
      <div className="sidebar-menu">
        {/* Logo */}
        <div className="sidebar-logo" onClick={handleLogoClick}>
          <img src={logoImage} alt="TechBridge" className="logo-image" />
        </div>

        {/* Menú Principal */}
        <div className="main-menu">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div
                key={item.id}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={item.onClick}
              >
                <div className="menu-icon">
                  <Icon />
                </div>
                <span>{item.label}</span>
                {item.badge && (
                  <div className="notification-badge">{item.badge}</div>
                )}
              </div>
            );
          })}

          <div className="menu-divider"></div>

          {/* Sección de Soporte */}
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="menu-item" onClick={item.onClick}>
                <div className="menu-icon">
                  <Icon />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Perfil del Usuario */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <div
            className="profile-avatar"
            style={{
              backgroundColor: getAvatarColor(
                companyName,
              ),
            }}
          >
            {getInitials(companyName)}
          </div>
          <div className="profile-details">
            <h4>{companyName}</h4>
            <p>{userEmail}</p>
          </div>
        </div>
        <div className="profile-dropdown">
          <div className="dropdown-content">
            <button className="logout-btn" onClick={handleLogout}>
              <HiLogout />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CompanySidebar;
