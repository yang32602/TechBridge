import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { CompanySidebar } from "../components";
import "../assets/styles.css";

// React Icons
import {
  HiBell,
  HiPencil,
  HiPlus,
  HiEye,
  HiArrowRight,
  HiLocationMarker,
  HiMail,
  HiGlobe,
  HiCog,
  HiOfficeBuilding,
  HiUsers,
} from "react-icons/hi";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const ProfileCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (user?.id) {
        try {
          const details = await ApiService.getCompanyByUserId(user.id);
          setCompanyDetails(details);
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      }
      setLoading(false);
    };

    fetchCompanyDetails();
  }, [user]);

  if (loading) {
    return (
      <div className="profile-company-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const companyName = companyDetails?.nombre || user?.name || "Nomad";

  return (
    <div className="profile-company-page">
      {/* Sidebar */}
      <CompanySidebar activeSection="company-profile" />

      {/* Main Content */}
      <main className="company-main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="company-info">
            <div className="company-logo">
              <div
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#56CDAD",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {companyName.charAt(0)}
              </div>
            </div>
            <div className="company-details">
              <p className="company-type">Empresa</p>
              <div className="company-name-section">
                <h2>{companyName}</h2>
                <div style={{ color: "#56CDAD", fontSize: 12 }}>✓</div>
              </div>
            </div>
          </div>
          <div className="top-nav-actions">
            <div className="notification-btn">
              <HiBell />
              <div className="notification-dot"></div>
            </div>
          </div>
        </nav>

        {/* Company Header */}
        <section className="company-header">
          <div className="company-logo-large">
            <div
              style={{
                width: 189,
                height: 189,
                backgroundColor: "#56CDAD",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {companyName.charAt(0)}
            </div>
            <button className="edit-logo-btn">
              <HiPencil />
            </button>
          </div>
          <div className="company-header-content">
            <div className="header-title">
              <h1>{companyName}</h1>
              <div className="header-actions">
                <button className="btn-secondary">
                  <HiEye />
                  Vista publica
                </button>
                <button className="btn-primary">
                  <HiCog />
                  Configuracion de Perfil
                </button>
              </div>
            </div>
            <a href="#" className="website-link">
              www.nomad.com
            </a>
            <div className="company-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <HiOfficeBuilding />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Fundacion</p>
                  <p className="stat-value">Julio 31, 2011</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <HiUsers />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Empleados</p>
                  <p className="stat-value">4000+</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="content-sections">
          <div className="left-content">
            {/* Company Description */}
            <section className="content-section">
              <div className="section-header">
                <h3>Descripción de la empresa</h3>
                <button className="edit-btn">
                  <HiPencil />
                </button>
              </div>
              <div className="company-description">
                Nomad is a software platform for starting and running internet
                businesses. Millions of businesses rely on Stripe's software
                tools to accept payments, expand globally, and manage their
                businesses online. Stripe has been at the forefront of expanding
                internet commerce, powering new business models, and supporting
                the latest platforms, from marketplaces to mobile commerce
                sites.
              </div>
            </section>

            <div className="section-divider"></div>

            {/* Contact Information */}
            <section className="content-section">
              <div className="section-header">
                <h3>Información de Contacto</h3>
                <div className="section-actions">
                  <button className="add-btn">
                    <HiPlus />
                  </button>
                  <button className="edit-btn">
                    <HiPencil />
                  </button>
                </div>
              </div>
              <div className="contact-links">
                <div className="contact-row">
                  <a href="#" className="contact-link">
                    <FaTwitter />
                    twitter.com/Nomad
                  </a>
                  <a href="#" className="contact-link">
                    <FaFacebook />
                    facebook.com/NomadHQ
                  </a>
                </div>
                <div className="contact-row">
                  <a href="#" className="contact-link">
                    <FaLinkedin />
                    linkedin.com/company/nomad
                  </a>
                  <a href="#" className="contact-link">
                    <HiMail />
                    nomad@gmail.com
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="right-content">
            {/* Company Stats */}
            <section className="content-section">
              <div className="section-header">
                <h3>Información de la empresa</h3>
                <button className="edit-btn">
                  <HiPencil />
                </button>
              </div>
              <div className="company-description">
                <p>
                  <strong>Industria:</strong> Internet · Software
                </p>
                <p>
                  <strong>Tamaño de la empresa:</strong> 1000+ empleados
                </p>
                <p>
                  <strong>Sede:</strong> Panama
                </p>
                <p>
                  <strong>Fundada:</strong> 2011
                </p>
                <p>
                  <strong>Especialidades:</strong> Startup, SaaS, E-commerce
                </p>
              </div>
            </section>

            {/* Job Applications */}
            <section className="content-section">
              <div className="section-header">
                <h3>Postulaciones de trabajo</h3>
                <div className="show-more">
                  <span>Mostrar mas</span>
                  <HiArrowRight />
                </div>
              </div>
              <div className="applications-list">
                <div className="application-item">
                  <div className="application-avatar">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/applicant1"
                      alt="Applicant"
                    />
                  </div>
                  <div className="application-details">
                    <h4>Jerome Bell</h4>
                    <div className="application-meta">
                      <span>UX/UI Designer</span>
                      <span>•</span>
                      <span>1 dia</span>
                    </div>
                    <div className="application-tags">
                      <span className="tag tag-green">Diseño</span>
                      <span className="tag tag-yellow">Tiempo completo</span>
                      <span className="tag tag-blue">En progreso</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="content-section">
              <div className="section-header">
                <h3>Tech Stack</h3>
                <div className="section-actions">
                  <button className="add-btn">
                    <HiPlus />
                  </button>
                  <button className="edit-btn">
                    <HiPencil />
                  </button>
                </div>
              </div>
              <div className="tech-stack">
                <div className="tech-row">
                  <div className="tech-item">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/html5"
                      alt="HTML5"
                    />
                    <span>HTML 5</span>
                  </div>
                  <div className="tech-item">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/css3"
                      alt="CSS3"
                    />
                    <span>CSS 3</span>
                  </div>
                  <div className="tech-item">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/javascript"
                      alt="JavaScript"
                    />
                    <span>JavaScript</span>
                  </div>
                </div>
                <div className="tech-row">
                  <div className="tech-item">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ruby"
                      alt="Ruby"
                    />
                    <span>Ruby</span>
                  </div>
                  <div className="tech-item">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/mixpanel"
                      alt="Mixpanel"
                    />
                    <span>Mixpanel</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileCompany;
