import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HiHome,
  HiChat,
  HiOfficeBuilding,
  HiUsers,
  HiBriefcase,
  HiQuestionMarkCircle,
  HiLogout,
  HiCurrencyDollar,
} from "react-icons/hi";
import logoImage from "../assets/Logo.png";
import "../assets/sidebar-common.css";
import "../assets/styles.css";
import { getInitials, getAvatarStyles } from "../utils/avatarUtils";

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
    navigate("/empresa-perfil");
  };

  const companyName = user?.realName || user?.name || "Empresa";
  const userEmail = user?.email || "empresa@email.com";

  const menuItems = [
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
      onClick: () => {},
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
      icon: HiChat,
      label: "Contáctanos",
      onClick: () => {},
    },
    {
      id: "help",
      icon: HiQuestionMarkCircle,
      label: "Centro de Ayuda",
      onClick: () => {},
    },
  ];

  return (
    <aside className="company-sidebar">
      {/* Header con Logo */}
      <div className="company-sidebar-header">
        <div className="company-sidebar-logo" onClick={handleLogoClick}>
          <img
            src={logoImage}
            alt="TechBridge"
            className="company-logo-image"
          />
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="company-sidebar-nav">
        <div className="company-nav-section">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div
                key={item.id}
                className={`company-nav-item ${isActive ? "active" : ""}`}
                onClick={item.onClick}
              >
                {isActive && <div className="company-nav-indicator"></div>}
                <div className="company-nav-content">
                  <div className="company-nav-icon">
                    <Icon />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <div className="company-notification-badge">{item.badge}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="company-nav-divider"></div>

        {/* Sección de Soporte */}
        <div className="company-nav-section">
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="company-nav-item"
                onClick={item.onClick}
              >
                <div className="company-nav-icon">
                  <Icon />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer con Usuario */}
      <div className="company-sidebar-footer">
        <div className="company-user-profile">
          <div
            className="company-user-avatar"
            style={getAvatarStyles(companyName, 48)}
          >
            <span className="company-user-initials">
              {getInitials(companyName)}
            </span>
          </div>
          <div className="company-user-info">
            <div className="company-user-name">{companyName}</div>
            <div className="company-user-email">{userEmail}</div>
          </div>
        </div>
        <div className="company-user-actions">
          <button className="company-logout-btn" onClick={handleLogout}>
            <HiLogout />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CompanySidebar;
