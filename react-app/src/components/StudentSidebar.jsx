import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HiHome,
  HiCode,
  HiClipboardList,
  HiSearch,
  HiOfficeBuilding,
  HiUser,
  HiChat,
  HiQuestionMarkCircle,
  HiLogout,
} from "react-icons/hi";
import logoImage from "../assets/Logo.png";
import "../assets/sidebar-common.css";

const StudentSidebar = ({ activeSection = "" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleProfileClick = () => {
    navigate("/profile-student");
  };

  const handleTechnicalTestsClick = () => {
    navigate("/technical-tests");
  };

  const userName = user?.realName || user?.name || "Usuario";
  const userEmail = user?.email || "usuario@email.com";

  const menuItems = [
    {
      id: "dashboard",
      icon: HiHome,
      label: "Dashboard",
      onClick: handleDashboardClick,
    },
    {
      id: "projects",
      icon: HiCode,
      label: "Proyectos",
      onClick: () => {},
    },
    {
      id: "technical-tests",
      icon: HiClipboardList,
      label: "Pruebas Técnicas",
      onClick: handleTechnicalTestsClick,
    },
    {
      id: "explore-jobs",
      icon: HiSearch,
      label: "Explorar Vacantes",
      onClick: () => navigate("/vacantes"),
    },
    {
      id: "recommended-jobs",
      icon: HiOfficeBuilding,
      label: "Vacantes Aplicadas",
      onClick: () => navigate("/vacantes-aplicadas"),
    },
    {
      id: "profile",
      icon: HiUser,
      label: "Perfil Público",
      onClick: handleProfileClick,
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
    <aside className="student-dashboard-sidebar">
      {/* Header con Logo */}
      <div className="student-sidebar-header">
        <div className="student-sidebar-logo" onClick={handleLogoClick}>
          <img
            src={logoImage}
            alt="TechBridge"
            className="student-logo-image"
          />
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="student-sidebar-nav">
        <div className="student-nav-section">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div
                key={item.id}
                className={`student-nav-item ${isActive ? "active" : ""}`}
                onClick={item.onClick}
              >
                {isActive && <div className="student-nav-indicator"></div>}
                <div className="student-nav-content">
                  <div className="student-nav-icon">
                    <Icon />
                  </div>
                  <span>{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="student-nav-divider"></div>

        {/* Sección de Soporte */}
        <div className="student-nav-section">
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="student-nav-item"
                onClick={item.onClick}
              >
                <div className="student-nav-icon">
                  <Icon />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer con Usuario */}
      <div className="student-sidebar-footer">
        <div className="student-user-profile">
          <div className="student-user-avatar">
            <span className="user-initials">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div className="student-user-info">
            <div className="student-user-name">{userName}</div>
            <div className="student-user-email">{userEmail}</div>
          </div>
          <div className="student-user-actions">
            <button className="student-logout-btn" onClick={handleLogout}>
              <HiLogout />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
