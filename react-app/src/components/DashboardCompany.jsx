import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import "../assets/styles.css";

// React Icons
import {
  HiHome,
  HiChat,
  HiOfficeBuilding,
  HiUsers,
  HiBriefcase,
  HiQuestionMarkCircle,
  HiLogout,
  HiUser,
  HiCog,
  HiChevronRight,
  HiPlus,
  HiBell,
  HiChevronDown,
} from "react-icons/hi";

const DashboardCompany = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile-company");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const companyName = user?.realName || user?.name || "Maria Kelly";
  const userEmail = user?.email || "MariaKlly@email.com";

  return (
    <div className="profile-company-page">
      {/* Sidebar */}
      <aside className="company-sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-logo" onClick={handleLogoClick}>
            <img src={logoImage} alt="TechBridge" className="logo-image" />
          </div>

          <div className="main-menu">
            {/* Dashboard - active */}
            <div className="menu-item active">
              <div className="menu-icon">
                <HiHome />
              </div>
              <span>Dashboard</span>
            </div>

            {/* Mensajes */}
            <div className="menu-item">
              <div className="menu-icon">
                <HiChat />
              </div>
              <span>Mensajes</span>
              <div className="notification-badge">1</div>
            </div>

            {/* Perfil de empresa */}
            <div className="menu-item" onClick={handleProfileClick}>
              <div className="menu-icon">
                <HiOfficeBuilding />
              </div>
              <span>Perfil de empresa</span>
            </div>

            {/* Solicitudes */}
            <div className="menu-item">
              <div className="menu-icon">
                <HiUsers />
              </div>
              <span>Solicitudes</span>
            </div>

            {/* Vacantes */}
            <div className="menu-item">
              <div className="menu-icon">
                <HiBriefcase />
              </div>
              <span>Vacantes</span>
            </div>

            <div className="menu-divider"></div>

            <div className="menu-item">
              <div className="menu-icon">
                <HiCog />
              </div>
              <span>Contactanos</span>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <HiQuestionMarkCircle />
              </div>
              <span>Centro de Ayuda</span>
            </div>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-info">
            <div className="profile-avatar">
              <span>
                {companyName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
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

      {/* Main Content */}
      <div className="company-dashboard-main">
        {/* Header */}
        <div className="company-dashboard-header">
          <div className="company-header-content">
            <div className="company-info">
              <div className="company-logo">
                <svg width="37" height="44" viewBox="0 0 37 44" fill="none">
                  <g clipPath="url(#clip0_514_16635)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.5 11.1201V32.4538L18.8241 43.471L19.2494 42.7861L18.8241 22.0811L1.13004 11.1328L0.5 11.1201Z"
                      fill="#449B82"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M36.9501 11.02V32.6542L18.8242 43.4713V22.0812L36.2862 11.0363L36.9501 11.02Z"
                      fill="#9BDB9C"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.725 0.402832L36.95 11.0196L18.8241 22.4377L0.5 11.1198L18.725 0.402832Z"
                      fill="#56CDAD"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M27.8783 8.91113L21.7143 12.5597V19.9238L15.5383 16.2154L9.59961 19.7306V35.1226L15.7636 31.3002V23.015L22.3473 27.2177L27.8783 23.7879V8.91113Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </div>
              <div className="company-details">
                <span className="company-type">Company</span>
                <div className="company-name">
                  <span>Nomad</span>
                  <HiChevronDown />
                </div>
              </div>
            </div>

            <div className="company-header-actions">
              <div className="company-notification-icon">
                <HiBell />
                <div className="company-notification-dot"></div>
              </div>
              <button className="company-btn-primary">
                <HiPlus />
                Publicar Vacante
              </button>
              <button
                className="company-btn-secondary"
                onClick={handleLogoClick}
              >
                Regresar a inicio
              </button>
            </div>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="company-greeting-section">
          <div className="company-greeting-content">
            <h2>Bienvenida, {companyName.split(" ")[0]}</h2>
            <p>
              A continuación se muestran las estadísticas generales de tu
              empresa.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="company-stats-section">
          <div className="company-stat-card blue">
            <div className="company-stat-content">
              <div className="company-stat-number">3</div>
              <div className="company-stat-label">Vacantes activas</div>
            </div>
            <HiChevronRight className="company-stat-arrow" />
          </div>

          <div className="company-stat-card green">
            <div className="company-stat-content">
              <div className="company-stat-number">12</div>
              <div className="company-stat-label">Nuevas postulaciones</div>
            </div>
            <HiChevronRight className="company-stat-arrow" />
          </div>

          <div className="company-stat-card orange">
            <div className="company-stat-content">
              <div className="company-stat-number">5</div>
              <div className="company-stat-label">Solicitudes enviadas</div>
            </div>
            <HiChevronRight className="company-stat-arrow" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="company-content-grid">
          {/* Applications Chart */}
          <div className="company-chart-card company-applications-chart">
            <div className="company-card-header">
              <h3>Postulaciones recibidas</h3>
              <div className="company-filter-dropdown">
                <span>Últimos 7 días</span>
                <HiChevronDown />
              </div>
            </div>
            <div className="company-chart-content">
              <div className="company-chart-y-axis">
                <span>1500</span>
                <span>1250</span>
                <span>1000</span>
                <span>750</span>
                <span>500</span>
                <span>250</span>
                <span>100</span>
                <span>0</span>
              </div>
              <div className="company-chart-area">
                <svg className="company-chart-line" viewBox="0 0 400 150">
                  <path
                    d="M20 120 C60 100, 100 80, 140 70 C180 60, 220 40, 260 30 C300 20, 340 35, 380 25"
                    stroke="#56CDAD"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle cx="280" cy="30" r="4" fill="#56CDAD" />
                </svg>
                <div className="company-chart-tooltip">
                  <div className="company-tooltip-content">
                    <span className="company-tooltip-label">Post</span>
                    <span className="company-tooltip-value">243</span>
                  </div>
                </div>
              </div>
              <div className="company-chart-x-axis">
                <span>19 Jul</span>
                <span>20 Jul</span>
                <span>21 Jul</span>
                <span>22 Jul</span>
                <span className="company-highlighted">23 Jul</span>
                <span>24 Jul</span>
                <span>25 Jul</span>
              </div>
            </div>
          </div>

          {/* Featured Candidates */}
          <div className="company-featured-candidates">
            <div className="company-card-header">
              <h3>Postulantes destacados</h3>
            </div>
            <div className="company-candidates-list">
              <div className="company-candidate-card">
                <div className="company-candidate-info">
                  <div className="company-candidate-avatar">
                    <span>JG</span>
                  </div>
                  <div className="company-candidate-details">
                    <h4>Jake Gyll</h4>
                    <span className="company-view-profile">Ver Perfil</span>
                  </div>
                </div>
                <div className="company-candidate-meta">
                  <div className="company-meta-item">
                    <span className="company-meta-label">Carrera</span>
                    <span className="company-meta-value">
                      Desarrollador de Software
                    </span>
                  </div>
                  <div className="company-meta-item">
                    <span className="company-meta-label">Universidad</span>
                    <span className="company-meta-value">
                      Universidad Tecnológica de Panamá
                    </span>
                  </div>
                </div>
              </div>

              <div className="company-candidate-card">
                <div className="company-candidate-info">
                  <div className="company-candidate-avatar">
                    <span>JG</span>
                  </div>
                  <div className="company-candidate-details">
                    <h4>Jake Gyll</h4>
                    <span className="company-view-profile">Ver Perfil</span>
                  </div>
                </div>
                <div className="company-candidate-meta">
                  <div className="company-meta-item">
                    <span className="company-meta-label">Carrera</span>
                    <span className="company-meta-value">Ciberseguridad</span>
                  </div>
                  <div className="company-meta-item">
                    <span className="company-meta-label">Universidad</span>
                    <span className="company-meta-value">
                      Universidad Tecnológica de Panamá
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Summary */}
        <div className="company-jobs-summary">
          <div className="company-card-header">
            <h3>Resumen de vancantes</h3>
            <div className="company-view-all">
              <span>Ver todo</span>
              <HiChevronRight />
            </div>
          </div>
          <div className="company-jobs-grid">
            <div className="company-job-card active">
              <div className="company-job-header">
                <div className="company-job-logo">
                  <svg width="37" height="44" viewBox="0 0 37 44" fill="none">
                    <g clipPath="url(#clip0_514_16635)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.5 11.1201V32.4538L18.8241 43.471L19.2494 42.7861L18.8241 22.0811L1.13004 11.1328L0.5 11.1201Z"
                        fill="#449B82"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M36.9501 11.02V32.6542L18.8242 43.4713V22.0812L36.2862 11.0363L36.9501 11.02Z"
                        fill="#9BDB9C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.725 0.402832L36.95 11.0196L18.8241 22.4377L0.5 11.1198L18.725 0.402832Z"
                        fill="#56CDAD"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M27.8783 8.91113L21.7143 12.5597V19.9238L15.5383 16.2154L9.59961 19.7306V35.1226L15.7636 31.3002V23.015L22.3473 27.2177L27.8783 23.7879V8.91113Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
                <span className="company-job-status active">Activo</span>
              </div>
              <h4>Desarrollador Frontend Junior</h4>
              <div className="company-job-tags">
                <span className="company-tag yellow">Híbrido</span>
                <span className="company-tag purple">T. Completo</span>
              </div>
              <p>5 aplicados de 10 reservados</p>
            </div>

            <div className="company-job-card closed">
              <div className="company-job-header">
                <div className="company-job-logo dropbox">
                  <svg width="39" height="36" viewBox="0 0 39 36" fill="none">
                    <g clipPath="url(#clip0_514_16960)">
                      <path
                        d="M9.90074 1.54932L0.300781 7.7468L9.90074 13.8531L19.5007 7.7468L9.90074 1.54932ZM29.1007 1.54932L19.5007 7.7468L29.1007 13.8531L38.7006 7.7468L29.1007 1.54932ZM0.300781 20.0506L9.90074 26.2481L19.5007 20.0506L9.90074 13.8531L0.300781 20.0506ZM29.1007 13.8531L19.5007 20.0506L29.1007 26.2481L38.7006 20.0506L29.1007 13.8531ZM9.90074 28.2532L19.5007 34.4506L29.1007 28.2532L19.5007 22.1468L9.90074 28.2532Z"
                        fill="#0062FF"
                      />
                    </g>
                  </svg>
                </div>
                <span className="company-job-status closed">Cerrada</span>
              </div>
              <h4>Desarrollador Node.js</h4>
              <div className="company-job-tags">
                <span className="company-tag green">Presencial</span>
                <span className="company-tag purple">T. Parcial</span>
              </div>
              <p>10 aplicados de 10 reservados</p>
            </div>

            <div className="company-job-card closed">
              <div className="company-job-header">
                <div className="company-job-logo terraform">
                  <svg width="35" height="40" viewBox="0 0 35 40" fill="none">
                    <g clipPath="url(#clip0_514_3099)">
                      <path
                        d="M12.2637 7.5957L22.4274 13.4888V25.2274L12.2637 19.3343V7.5957Z"
                        fill="#21D4EF"
                      />
                      <path
                        d="M24.2324 13.4888L34.3962 7.5957V19.3343L24.2324 25.2274V13.4888Z"
                        fill="#21D4EF"
                      />
                      <path
                        d="M0.201172 0.799805L10.3649 6.69287V18.4315L0.201172 12.5384V0.799805Z"
                        fill="#21D4EF"
                      />
                      <path
                        d="M12.2637 21.5684L22.4274 27.4139V39.2001L12.2637 33.307V21.5684Z"
                        fill="#21D4EF"
                      />
                    </g>
                  </svg>
                </div>
                <span className="company-job-status closed">Cerrada</span>
              </div>
              <h4>Desarrollador Android Junior</h4>
              <div className="company-job-tags">
                <span className="company-tag yellow">Híbrido</span>
                <span className="company-tag purple">T. Parcial</span>
              </div>
              <p>10 aplicados de 10 reservados</p>
            </div>

            <div className="company-job-card active">
              <div className="company-job-header">
                <div className="company-job-logo classpass">
                  <HiBriefcase
                    style={{ width: "48px", height: "48px", color: "#666" }}
                  />
                </div>
                <span className="company-job-status active">Activo</span>
              </div>
              <h4>Asistente de BI</h4>
              <div className="company-job-tags">
                <span className="company-tag green">Presencial</span>
                <span className="company-tag purple">T. Completo</span>
              </div>
              <p>5 aplicados de 10 reservados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCompany;
