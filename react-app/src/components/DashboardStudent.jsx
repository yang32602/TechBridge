import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import "../assets/profile-student.css";

// React Icons
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

const DashboardStudent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile-student");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userName = user?.realName || user?.name || "Jake Gyll";
  const userEmail = user?.email || "jakegyll@email.com";

  return (
    <div className="profile-student-container">
      {/* Sidebar */}
      <aside className="student-dashboard-sidebar">
        <div className="student-sidebar-header">
          <div className="student-sidebar-logo" onClick={handleLogoClick}>
            <img
              src={logoImage}
              alt="TechBridge"
              className="student-logo-image"
            />
          </div>
        </div>

        <nav className="student-sidebar-nav">
          <div className="student-nav-section">
            <div className="student-nav-item active">
              <div className="student-nav-icon">
                <HiHome />
              </div>
              <span>Dashboard</span>
            </div>
            <div className="student-nav-item">
              <div className="student-nav-icon">
                <HiCode />
              </div>
              <span>Proyectos</span>
            </div>
            <div
              className="student-nav-item"
              onClick={() => navigate("/technical-tests")}
            >
              <div className="student-nav-icon">
                <HiClipboardList />
              </div>
              <span>Pruebas Técnicas</span>
            </div>
            <div className="student-nav-item">
              <div className="student-nav-icon">
                <HiSearch />
              </div>
              <span>Explorar Vacantes</span>
            </div>
            <div className="student-nav-item">
              <div className="student-nav-icon">
                <HiOfficeBuilding />
              </div>
              <span>Vacantes Recomendadas</span>
            </div>
            <div className="student-nav-item" onClick={handleProfileClick}>
              <div className="student-nav-icon">
                <HiUser />
              </div>
              <span>Perfil Público</span>
            </div>
          </div>

          <div className="student-nav-divider"></div>

          <div className="student-nav-section">
            <div className="student-nav-item">
              <div className="student-nav-icon">
                <HiChat />
              </div>
              <span>Contactanos</span>
            </div>
            <div className="student-nav-item">
              <div className="student-nav-icon">
                <HiQuestionMarkCircle />
              </div>
              <span>Centro de Ayuda</span>
            </div>
          </div>
        </nav>

        <div className="student-sidebar-footer">
          <div className="student-user-profile">
            <div className="student-user-avatar">
              <span>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
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

      {/* Main Content */}
      <div className="student-dashboard-main">
        {/* Header */}
        <div className="student-dashboard-header">
          <div className="student-header-content">
            <h1>Dashboard</h1>
            <div className="student-header-actions">
              <button className="student-btn-primary">
                <HiSearch className="btn-icon" />
                Test de Orientación
              </button>
              <button
                className="student-btn-secondary"
                onClick={handleLogoClick}
              >
                Regresar a inicio
              </button>
            </div>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="student-greeting-section">
          <div className="student-greeting-content">
            <h2>Bienvenido, {userName.split(" ")[0]}</h2>
            <p>
              A continuación se muestra tu progreso y oportunidades disponibles
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="student-stats-section">
          <div className="student-stats-grid">
            <div className="student-stat-card">
              <div className="student-stat-content">
                <div className="student-stat-number">3</div>
                <div className="student-stat-label">Pruebas Completadas</div>
              </div>
              <div className="student-stat-icon">
                <HiClipboardList />
              </div>
            </div>

            <div className="student-stat-card">
              <div className="student-stat-content">
                <div className="student-stat-number">3</div>
                <div className="student-stat-label">Proyectos subidos</div>
              </div>
              <div className="student-stat-icon">
                <HiCode />
              </div>
            </div>

            <div className="student-stat-card">
              <div className="student-stat-content">
                <div className="student-stat-number">6</div>
                <div className="student-stat-label">Vacantes disponibles</div>
              </div>
              <div className="student-stat-icon">
                <HiOfficeBuilding />
              </div>
            </div>

            <div className="student-stat-card">
              <div className="student-stat-content">
                <div className="student-stat-number">30%</div>
                <div className="student-stat-label">Perfil completado</div>
              </div>
              <div className="student-stat-icon">
                <HiUser />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="student-charts-section">
          <div className="student-chart-grid">
            {/* Technical Tests */}
            <div className="student-chart-card">
              <div className="student-card-header">
                <h3>Pruebas Técnicas Disponibles</h3>
              </div>
              <div className="student-card-content">
                <div className="student-test-item">
                  <div className="student-test-info">
                    <h4>Evaluación Frontend avanzado</h4>
                    <p>React, Javascript, CSS</p>
                  </div>
                  <span className="student-badge available">Disponible</span>
                </div>

                <div className="student-test-item">
                  <div className="student-test-info">
                    <h4>Test Python</h4>
                    <p>Python, Django, APIs</p>
                  </div>
                  <span className="student-badge completed">Completado</span>
                </div>

                <div className="student-test-item">
                  <div className="student-test-info">
                    <h4>Prueba Bases de Datos</h4>
                    <p>SQL, PostgreSQL</p>
                  </div>
                  <span className="student-badge available">Disponible</span>
                </div>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="student-chart-card student-recommended-jobs">
              <div className="student-card-header">
                <h3>Vacantes Recomendadas</h3>
              </div>
              <div className="student-card-content">
                <div className="student-job-item">
                  <h4>Desarrollador Backend</h4>
                  <p>Python</p>
                </div>
                <div className="student-job-item">
                  <h4>Software Developer S.A</h4>
                  <p>Frontend</p>
                </div>
                <div className="student-job-item">
                  <h4>Web Solutions</h4>
                  <p>Desarrollador de Software</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects and Skills Section */}
        <div className="student-bottom-section">
          <div className="student-bottom-grid">
            {/* Projects */}
            <div className="student-projects-card">
              <div className="student-card-header">
                <h3>Proyectos subidos</h3>
              </div>
              <div className="student-card-content">
                <div className="student-project-item">
                  <div className="student-project-icon">
                    <HiCode />
                  </div>
                  <div className="student-project-info">
                    <h4>Gestor de tareas</h4>
                    <p>React, MongoDB, NodeJs</p>
                  </div>
                  <button className="student-btn-view">Ver más</button>
                </div>

                <div className="student-project-item">
                  <div className="student-project-icon">
                    <HiCode />
                  </div>
                  <div className="student-project-info">
                    <h4>Aplicación de Clima</h4>
                    <p>Python</p>
                  </div>
                  <button className="student-btn-view">Ver más</button>
                </div>

                <div className="student-project-item">
                  <div className="student-project-icon">
                    <HiCode />
                  </div>
                  <div className="student-project-info">
                    <h4>Sistema de inventario</h4>
                    <p>Python, Flask, PostgreSQL</p>
                  </div>
                  <button className="student-btn-view">Ver más</button>
                </div>
              </div>
            </div>

            {/* Skills Progress */}
            <div className="student-skills-card">
              <div className="student-card-header">
                <h3>Progreso de Habilidades</h3>
              </div>
              <div className="student-card-content">
                <div className="student-skill-item">
                  <div className="student-skill-info">
                    <h4>Desarrollo Frontend</h4>
                    <div className="student-skill-bar">
                      <div
                        className="student-skill-progress"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="student-skill-item">
                  <div className="student-skill-info">
                    <h4>Desarrollo Backend</h4>
                    <div className="student-skill-bar">
                      <div
                        className="student-skill-progress student-backend"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="student-skill-item">
                  <div className="student-skill-info">
                    <h4>Gestión de Base de datos</h4>
                    <div className="student-skill-bar">
                      <div
                        className="student-skill-progress student-database"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
