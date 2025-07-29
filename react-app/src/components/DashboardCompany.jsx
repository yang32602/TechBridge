import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CompanySidebar } from "./index";
import "../assets/styles.css";

// React Icons
import {
  HiChevronRight,
  HiPlus,
  HiBell,
  HiChevronDown,
  HiBriefcase,
  HiOfficeBuilding,
  HiTrendingUp,
  HiCube,
} from "react-icons/hi";

const DashboardCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const companyName = user?.realName || user?.name || "Maria Kelly";

  return (
    <div className="profile-company-page">
      {/* Sidebar */}
      <CompanySidebar activeSection="dashboard" />

      {/* Main Content */}
      <div className="company-dashboard-main">
        
        {/* Greeting Section */}
        <div className="company-greeting-section">
          <div className="company-greeting-content">
            <h2>Bienvenida, {companyName.split(" ")[0]}</h2>
            <p>
              A continuación se muestran las estadísticas generales de tu
              empresa.
            </p>
          </div>
          <div className="company-header-actions">         
              <button
                className="company-btn-secondary"
                onClick={handleLogoClick}
              >
                Regresar a inicio
              </button>
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
                <div className="company-chart-placeholder">
                  <HiTrendingUp
                    style={{ width: "60px", height: "60px", color: "#56CDAD" }}
                  />
                  <span className="chart-label">Gráfico de postulaciones</span>
                </div>
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
                  <HiOfficeBuilding
                    style={{ width: "37px", height: "44px", color: "#56CDAD" }}
                  />
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
                  <HiBriefcase
                    style={{ width: "39px", height: "36px", color: "#0062FF" }}
                  />
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
                  <HiCube
                    style={{ width: "35px", height: "40px", color: "#21D4EF" }}
                  />
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
