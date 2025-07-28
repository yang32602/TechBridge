import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ApiService from "../services/api";
import { CompanySidebar } from "../components";
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
  HiPhone,
  HiSave,
  HiX,
  HiArrowLeft,
} from "react-icons/hi";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import "../assets/styles.css";
import { getInitials, getCompanyAvatarStyles } from "../utils/avatarUtils";

const EmpresaPerfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const location = useLocation();
  
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Check if this is read-only mode (viewing another company's profile)
  const isReadOnly = companyId || location.state?.readOnly;
  const targetUserId = companyId || user?.id;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (targetUserId) {
        try {
          let details;
          if (isReadOnly && companyId) {
            // For read-only mode, fetch by company ID
            details = await ApiService.getCompanyById(companyId);
          } else {
            // For own profile, fetch by user ID
            details = await ApiService.getCompanyByUserId(targetUserId);
          }
          setCompanyDetails(details);
          setEditForm(details || {});
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      }
      setLoading(false);
    };

    fetchCompanyDetails();
  }, [targetUserId, companyId, isReadOnly]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditForm(companyDetails || {});
  };

  const handleSave = async (field) => {
    setSaving(true);
    try {
      await ApiService.updateCompanyField(user.id, field, editForm[field]);
      
      // Update local state
      setCompanyDetails(prev => ({ ...prev, [field]: editForm[field] }));
      setEditingField(null);
      
      // Show success message briefly
      const successMessage = document.createElement('div');
      successMessage.className = 'success-notification';
      successMessage.innerHTML = `<span>✓ ${field} actualizado exitosamente</span>`;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } catch (error) {
      console.error("Error updating company field:", error);
      alert("Error al actualizar el campo. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };



  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-company-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const companyName = companyDetails?.nombre || user?.name || "Empresa";

  return (
    <div className="profile-company-page">
      {/* Sidebar - only show if not in read-only mode */}
      {!isReadOnly && <CompanySidebar activeSection="company-profile" />}

      {/* Main Content */}
      <main className="company-main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="company-info">
            <div className="company-logo">
              <div style={getCompanyAvatarStyles(companyName, 48, 8)}>
                {getInitials(companyName)}
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
            {isReadOnly ? (
              <button 
                onClick={() => navigate(-1)}
                className="back-button"
              >
                <HiArrowLeft />
                Volver
              </button>
            ) : (
              <div className="notification-btn">
                <HiBell />
                <div className="notification-dot"></div>
              </div>
            )}
          </div>
        </nav>

        {/* Company Header */}
        <section className="company-header">
          <div className="company-logo-large">
            <div style={getCompanyAvatarStyles(companyName, 189, 8)}>
              {getInitials(companyName)}
            </div>
            {!isReadOnly && (
              <button className="edit-logo-btn">
                <HiPencil />
              </button>
            )}
          </div>
          <div className="company-header-content">
            <div className="header-title">
              <h1>{companyName}</h1>
              {!isReadOnly && (
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
              )}
            </div>
            {companyDetails?.link_empresa && (
              <a href={companyDetails.link_empresa} className="website-link" target="_blank" rel="noopener noreferrer">
                {companyDetails.link_empresa}
              </a>
            )}
            <div className="company-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <HiOfficeBuilding />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Fundación</p>
                  <p className="stat-value">
                    {formatDate(companyDetails?.fecha_fundada)}
                  </p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <HiUsers />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Empleados</p>
                  <p className="stat-value">
                    {companyDetails?.empleados || "No especificado"}
                  </p>
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
                {!isReadOnly && (
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit('descripcion')}
                    disabled={editingField === 'descripcion'}
                  >
                    <HiPencil />
                  </button>
                )}
              </div>
              <div className="company-description">
                {editingField === 'descripcion' ? (
                  <div className="edit-container">
                    <textarea
                      value={editForm.descripcion || ''}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      className="edit-textarea"
                      rows="4"
                      placeholder="Descripción de la empresa"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        disabled={saving}
                      >
                        <HiX />
                      </button>
                      <button 
                        onClick={() => handleSave('descripcion')}
                        className="save-btn"
                        disabled={saving}
                      >
                        <HiSave />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{companyDetails?.descripcion || "No hay descripción disponible"}</p>
                )}
              </div>
            </section>

            <div className="section-divider"></div>

            {/* Contact Information */}
            <section className="content-section">
              <div className="section-header">
                <h3>Información de Contacto</h3>
                {!isReadOnly && (
                  <div className="section-actions">
                    <button className="add-btn">
                      <HiPlus />
                    </button>
                    <button className="edit-btn">
                      <HiPencil />
                    </button>
                  </div>
                )}
              </div>
              <div className="contact-links">
                <div className="contact-row">
                  {companyDetails?.twitter && (
                    <a href={companyDetails.twitter} className="contact-link" target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                      {companyDetails.twitter}
                    </a>
                  )}
                  {companyDetails?.facebook && (
                    <a href={companyDetails.facebook} className="contact-link" target="_blank" rel="noopener noreferrer">
                      <FaFacebook />
                      {companyDetails.facebook}
                    </a>
                  )}
                </div>
                <div className="contact-row">
                  {companyDetails?.linkedin && (
                    <a href={companyDetails.linkedin} className="contact-link" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin />
                      {companyDetails.linkedin}
                    </a>
                  )}
                  {companyDetails?.telefono && (
                    <div className="contact-link">
                      <HiPhone />
                      {companyDetails.telefono}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="right-content">
            {/* Company Stats */}
            <section className="content-section">
              <div className="section-header">
                <h3>Información de la empresa</h3>
                {!isReadOnly && (
                  <button className="edit-btn">
                    <HiPencil />
                  </button>
                )}
              </div>
              <div className="company-description">
                <p>
                  <strong>Sector:</strong> {companyDetails?.sector || "No especificado"}
                </p>
                <p>
                  <strong>RUC:</strong> {companyDetails?.ruc || "No especificado"}
                </p>
                <p>
                  <strong>Empleados:</strong> {companyDetails?.empleados || "No especificado"}
                </p>
                <p>
                  <strong>Fundada:</strong> {formatDate(companyDetails?.fecha_fundada)}
                </p>
                {companyDetails?.telefono && (
                  <p>
                    <strong>Teléfono:</strong> {companyDetails.telefono}
                  </p>
                )}
              </div>
            </section>

            {/* Tech Stack - Keep as specified */}
            <section className="content-section">
              <div className="section-header">
                <h3>Tech Stack</h3>
                {!isReadOnly && (
                  <div className="section-actions">
                    <button className="add-btn">
                      <HiPlus />
                    </button>
                    <button className="edit-btn">
                      <HiPencil />
                    </button>
                  </div>
                )}
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

      {/* Success notification styles */}
      <style jsx>{`
        .success-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          font-weight: 500;
        }
        
        .edit-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .edit-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          min-height: 100px;
        }
        
        .edit-textarea:focus {
          outline: none;
          border-color: #56cdad;
        }
        
        .edit-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        
        .cancel-btn, .save-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-btn {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .cancel-btn:hover {
          background: #e5e7eb;
        }
        
        .save-btn {
          background: #56cdad;
          color: white;
        }
        
        .save-btn:hover {
          background: #4ade80;
        }
        
        .save-btn:disabled, .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .back-button:hover {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default EmpresaPerfil;
