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
  HiCalendar,
  HiIdentification,
} from "react-icons/hi";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import "../assets/profile-student.css";
import "../assets/empresa-perfil.css";
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
  const targetCompanyId = companyId || user?.id_empresa;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (targetCompanyId) {
        try {
          let details;
          if (companyId) {
            // When companyId is provided (read-only mode), it's always an id_empresa
            console.log("EmpresaPerfil: Fetching company by ID:", companyId);
            details = await ApiService.getCompanyById(companyId);
            console.log("EmpresaPerfil: Received company details:", details);
          } else {
            // For own profile, fetch by user ID to get company data
            const userId = user?.id_empresa || user?.id;
            console.log("EmpresaPerfil: Fetching company by user ID:", userId);
            details = await ApiService.getCompanyByUserId(userId);
            console.log("EmpresaPerfil: Received company details:", details);
          }
          setCompanyDetails(details);
          setEditForm(details || {});
        } catch (error) {
          console.error("EmpresaPerfil: Error fetching company details:", error);
          // 确保在错误情况下设置空数据
          setCompanyDetails(null);
        }
      }
      setLoading(false);
    };

    fetchCompanyDetails();
  }, [targetCompanyId, companyId, isReadOnly]);

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
      // Use id_empresa from user context
      const empresaId = user?.id_empresa;
      if (!empresaId) {
        throw new Error("No se encontró el ID de empresa en el contexto del usuario");
      }

      await ApiService.updateCompanyField(empresaId, field, editForm[field]);

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
      <div className="profile-student-container">
        <div className="student-loading">Cargando...</div>
      </div>
    );
  }

  // Show error message if in read-only mode and no company found
  if (isReadOnly && !companyDetails && companyId) {
    return (
      <div className="profile-student-container">
        <div className="student-loading">
          <h2>Empresa no encontrada</h2>
          <p>No se pudo encontrar la empresa con ID: {companyId}</p>
          <p>Es posible que:</p>
          <ul>
            <li>La empresa no exista en la base de datos</li>
            <li>Haya un problema de conexión con el servidor</li>
            <li>La empresa haya sido eliminada</li>
          </ul>
          <button
            onClick={() => navigate(-1)}
            className="student-btn-return"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const companyName = companyDetails?.nombre || (isReadOnly ? "Empresa no encontrada" : user?.name) || "Empresa";

  return (
    <div className={`profile-student-container ${isReadOnly ? "profile-student-readonly" : ""}`}>
      {/* Sidebar - only show if not in read-only mode */}
      {!isReadOnly && <CompanySidebar activeSection="company-profile" />}

      {/* Main Content */}
      <main className="student-dashboard-main">
        {/* Top Navigation */}
        <header className="student-dashboard-header">
          <h1>{isReadOnly ? "Perfil de la Empresa" : "Mi Perfil de Empresa"}</h1>
          <button
            className="student-btn-return"
            onClick={() => {
              if (isReadOnly) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
          >
            {isReadOnly ? "Volver" : "Regresar a Inicio"}
          </button>
        </header>

        <div className="student-dashboard-content">
          <div className="student-main-content">
            {/* Profile Header */}
            <section className="student-profile-header-card">
              <div className="student-profile-banner">
                <div className="student-banner-overlay"></div>
              </div>
              <div className="student-profile-info">
                <div
                  className="student-profile-avatar student-avatar-initials"
                  style={getCompanyAvatarStyles(companyName, 140)}
                >
                  {getInitials(companyName)}
                </div>
                <div className="student-profile-details">
                  <h2 className="student-profile-name">{companyName}</h2>
                  <div className="student-profile-location">
                    <HiOfficeBuilding />
                    <span>Sector: {companyDetails?.sector || "No especificado"}</span>
                  </div>
                  <div className="student-profile-status">
                    <HiUsers />
                    <span>Empleados: {companyDetails?.empleados || "No especificado"}</span>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="student-profile-actions">
                    <button className="student-btn-edit-profile" onClick={() => navigate("/empresa-perfil", { state: { readOnly: true } })}>
                      <HiEye />
                      Vista Pública
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Company Description */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Descripción de la empresa</h3>
                {!isReadOnly && (
                  <button 
                    className="student-add-btn"
                    onClick={() => handleEdit('descripcion')}
                    disabled={editingField === 'descripcion'}
                  >
                    <HiPencil />
                  </button>
                )}
              </div>
              <div className="student-card-content">
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


            {/* Contact Information */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Información de Contacto</h3>
              </div>
              <div className="student-card-content">
                <div className="contact-grid">
                  <div className="contact-item">
                    <FaTwitter />
                    {editingField === 'twitter' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.twitter || ''}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de Twitter"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('twitter')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        {companyDetails?.twitter ? (
                          <a href={companyDetails.twitter} target="_blank" rel="noopener noreferrer">
                            {companyDetails.twitter}
                          </a>
                        ) : (
                          <span>No especificado</span>
                        )}
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('twitter')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="contact-item">
                    <FaFacebook />
                    {editingField === 'facebook' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.facebook || ''}
                          onChange={(e) => handleInputChange('facebook', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de Facebook"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('facebook')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        {companyDetails?.facebook ? (
                          <a href={companyDetails.facebook} target="_blank" rel="noopener noreferrer">
                            {companyDetails.facebook}
                          </a>
                        ) : (
                          <span>No especificado</span>
                        )}
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('facebook')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="contact-item">
                    <FaLinkedin />
                    {editingField === 'linkedin' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.linkedin || ''}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de LinkedIn"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('linkedin')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        {companyDetails?.linkedin ? (
                          <a href={companyDetails.linkedin} target="_blank" rel="noopener noreferrer">
                            {companyDetails.linkedin}
                          </a>
                        ) : (
                          <span>No especificado</span>
                        )}
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('linkedin')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="contact-item">
                    <HiGlobe />
                    {editingField === 'link_empresa' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.link_empresa || ''}
                          onChange={(e) => handleInputChange('link_empresa', e.target.value)}
                          className="contact-edit-input"
                          placeholder="Sitio web de la empresa"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('link_empresa')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        {companyDetails?.link_empresa ? (
                          <a href={companyDetails.link_empresa} target="_blank" rel="noopener noreferrer">
                            {companyDetails.link_empresa}
                          </a>
                        ) : (
                          <span>No especificado</span>
                        )}
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('link_empresa')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="student-sidebar-right">
            {/* Company Info */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Información de la empresa</h3>
              </div>
              <div className="student-contact-list">
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiIdentification />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">RUC</div>
                    {editingField === 'ruc' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.ruc || ''}
                          onChange={(e) => handleInputChange('ruc', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Número de RUC"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('ruc')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{companyDetails?.ruc || "No especificado"}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('ruc')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiCalendar />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Fundación</div>
                    {editingField === 'fecha_fundada' ? (
                      <div className="inline-edit-container">
                        <input
                          type="date"
                          value={editForm.fecha_fundada ? editForm.fecha_fundada.split('T')[0] : ''}
                          onChange={(e) => handleInputChange('fecha_fundada', e.target.value)}
                          className="inline-edit-input"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('fecha_fundada')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{formatDate(companyDetails?.fecha_fundada)}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('fecha_fundada')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiUsers />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Empleados</div>
                    {editingField === 'empleados' ? (
                      <div className="inline-edit-container">
                        <input
                          type="number"
                          value={editForm.empleados || ''}
                          onChange={(e) => handleInputChange('empleados', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Número de empleados"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('empleados')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{companyDetails?.empleados || "No especificado"}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('empleados')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiOfficeBuilding />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Sector</div>
                    {editingField === 'sector' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.sector || ''}
                          onChange={(e) => handleInputChange('sector', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Sector de la empresa"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('sector')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{companyDetails?.sector || "No especificado"}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('sector')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiPhone />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Teléfono</div>
                    {editingField === 'telefono' ? (
                      <div className="inline-edit-container">
                        <input
                          type="tel"
                          value={editForm.telefono || ''}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Número de teléfono"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('telefono')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{companyDetails?.telefono || "No especificado"}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('telefono')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Company Stats */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Estadísticas</h3>
              </div>
              <div className="student-badges-grid">
                <div className="student-badge verified">Verificada</div>
                <div className="student-badge active">Activa</div>
                <div className="student-badge hiring">Contratando</div>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Tech Stack</h3>
                {!isReadOnly && (
                  <button className="student-add-btn">
                    <HiPlus />
                  </button>
                )}
              </div>
              <div className="tech-stack-grid">
                <div className="tech-item">
                  <img
                    src="https://emaillistvalidation.com/blog/content/images/2023/09/HTML5_logo_and_wordmark.svg.png"
                    alt="HTML5"
                  />
                  <span>HTML 5</span>
                </div>
                <div className="tech-item">
                  <img
                    src="https://th.bing.com/th/id/R.7b457240e4d8e8c126e7a32a59b45092?rik=%2bRVFTCYajtr9Hg&riu=http%3a%2f%2froarytubbs.com%2fwp-content%2fuploads%2f2016%2f07%2fcss3-logo.png&ehk=aQnQzJk3cGDGGE3VWOg3E1xFPU8vdUYcK5b8roNFgcg%3d&risl=&pid=ImgRaw&r=0"
                    alt="CSS3"
                  />
                  <span>CSS 3</span>
                </div>
                <div className="tech-item">
                  <img
                    src="https://mseeeen.msen.jp/static/dff36bad692fa63eb3583a4c8983e3c1/82c11/javascript-map-function.png"
                    alt="JavaScript"
                  />
                  <span>JavaScript</span>
                </div>
                <div className="tech-item">
                  <img
                    src="https://cdn.icon-icons.com/icons2/2415/PNG/512/ruby_original_wordmark_logo_icon_146364.png"
                    alt="Ruby"
                  />
                  <span>Ruby</span>
                </div>
                <div className="tech-item">
                  <img
                    src="https://assets-global.website-files.com/5ecbeb8d7557e7f636691721/65834e7669a30c48bec769fe_Mixpanel_logo.png"
                    alt="Mixpanel"
                  />
                  <span>Mixpanel</span>
                </div>
              </div>
            </section>
          </aside>
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
        
        .company-avatar-large {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          padding: 16px 0;
        }
        
        .tech-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .tech-item img {
          width: 32px;
          height: 32px;
        }
        
        .tech-item span {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
        }
        
        .contact-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        
        .contact-item svg {
          font-size: 20px;
          color: #6c757d;
        }
        
        .contact-item a {
          color: #007bff;
          text-decoration: none;
        }
        
        .contact-item a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default EmpresaPerfil;
