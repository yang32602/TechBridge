import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ApiService from "../services/api";
import {
  StudentSidebar,
  PaginatedItems,
  ExperienceItem,
  EducationItem,
} from "../components";
import EditProfileModal from "../components/EditProfileModal";
import "../assets/profile-student.css";
import "../assets/experience-item.css";
import "../assets/education-item.css";
import "../assets/paginated-items.css";
import "../assets/empresa-perfil.css";
import { getInitials, getAvatarStyles } from "../utils/avatarUtils";

// React Icons
import {
  HiPencil,
  HiPlus,
  HiLocationMarker,
  HiFlag,
  HiMail,
  HiPhone,
  HiTranslate,
  HiDownload,
  HiIdentification,
  HiCalendar,
  HiSave,
  HiX,
  HiEye,
} from "react-icons/hi";
import { FaGithub, FaTwitter, FaReddit } from "react-icons/fa";

const ProfileStudent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const location = useLocation();
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [addingExperience, setAddingExperience] = useState(false);
  const [education, setEducation] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [addingEducation, setAddingEducation] = useState(false);

  // Inline editing states
  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Badges state
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(false);

  // Check if this is read-only mode (viewing another student's profile)
  const isReadOnly = studentId || location.state?.readOnly;
  const targetUserId = studentId || user?.id;

  useEffect(() => {
    const fetchStudentDetails = async () => {
      console.log("ProfileStudent: user object:", user);
      if (targetUserId) {
        console.log(
          "ProfileStudent: fetching details for user.id:",
          targetUserId,
        );
        try {
          const details = await ApiService.getStudentByUserId(targetUserId);
          console.log("ProfileStudent: received details:", details);
          setStudentDetails(details);
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      } else {
        console.log("ProfileStudent: No user ID available");
      }
      setLoading(false);
    };

    fetchStudentDetails();
  }, [user, targetUserId]);

  // Fetch experiences when studentDetails is available
  useEffect(() => {
    const fetchExperiences = async () => {
      if (studentDetails?.id) {
        console.log("Fetching experiences for student ID:", studentDetails.id);
        setExperiencesLoading(true);
        try {
          const experiencesData = await ApiService.getStudentExperiences(
            studentDetails.id,
          );
          console.log("Received experiences data:", experiencesData);
          setExperiences(experiencesData);
        } catch (error) {
          console.error("Error fetching experiences:", error);
        } finally {
          setExperiencesLoading(false);
        }
      } else {
        console.log("No student ID available for experiences:", studentDetails);
      }
    };

    fetchExperiences();
  }, [studentDetails]);

  // Fetch education when studentDetails is available
  useEffect(() => {
    const fetchEducation = async () => {
      if (studentDetails?.id) {
        console.log("Fetching education for student ID:", studentDetails.id);
        setEducationLoading(true);
        try {
          const educationData = await ApiService.getStudentEducation(
            studentDetails.id,
          );
          console.log("Received education data:", educationData);
          setEducation(educationData);
        } catch (error) {
          console.error("Error fetching education:", error);
        } finally {
          setEducationLoading(false);
        }
      } else {
        console.log("No student ID available for education:", studentDetails);
      }
    };

    fetchEducation();
  }, [studentDetails]);

  // Fetch badges when studentDetails is available
  useEffect(() => {
    const fetchBadges = async () => {
      if (targetUserId) {
        console.log("Fetching badges for user ID:", targetUserId);
        setBadgesLoading(true);
        try {
          const badgesData = await ApiService.getStudentBadges(targetUserId);
          console.log("Received badges data:", badgesData);
          setBadges(badgesData);
        } catch (error) {
          console.error("Error fetching badges:", error);
        } finally {
          setBadgesLoading(false);
        }
      }
    };

    fetchBadges();
  }, [targetUserId]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAddExperience = async () => {
    if (!studentDetails?.id) return;

    const response = await ApiService.addStudentExperience(studentDetails.id);
    if (response && response.estado === 1) {
      // Refetch experiences to get the updated list
      const experiencesData = await ApiService.getStudentExperiences(
        studentDetails.id,
      );
      setExperiences(experiencesData);
    }
  };

  const handleUpdateExperience = (updatedExperience) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp,
      ),
    );
  };

  const handleDeleteExperience = (deletedId) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== deletedId));
  };

  const handleAddEducation = async () => {
    if (!studentDetails?.id) return;

    const response = await ApiService.addStudentEducation(studentDetails.id);
    if (response && response.estado === 1) {
      // Refetch education to get the updated list
      const educationData = await ApiService.getStudentEducation(
        studentDetails.id,
      );
      setEducation(educationData);
    }
  };

  const handleUpdateEducation = (updatedEducation) => {
    setEducation((prev) =>
      prev.map((edu) =>
        edu.id === updatedEducation.id ? updatedEducation : edu,
      ),
    );
  };

  const handleDeleteEducation = (deletedId) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== deletedId));
  };

  // Inline editing handlers
  const handleEdit = (field) => {
    setEditingField(field);
    setEditForm({ ...editForm, [field]: studentDetails?.[field] || '' });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditForm({});
  };

  const handleSave = async (field) => {
    setSaving(true);
    try {
      // Update student field via API
      await ApiService.updateStudentField(studentDetails.id_usuario, field, editForm[field]);

      // Update local state
      setStudentDetails(prev => ({ ...prev, [field]: editForm[field] }));
      setEditingField(null);
      setEditForm({});

      // Show success message
      setSuccessMessage(`${field} actualizado exitosamente`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating student field:", error);
      alert("Error al actualizar el campo. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="profile-student-container">
        <div className="student-loading">Cargando...</div>
      </div>
    );
  }

  // Use studentDetails if available (read-only mode or own profile), fallback to current user
  const userName = studentDetails?.nombre_completo || user?.name || "Jake Gyll";
  const userEmail = isReadOnly
    ? studentDetails?.correo || "No especificado"
    : user?.email || "usuario@email.com";
  const userCedula = studentDetails?.cedula || "No especificado";
  const userFechaNacimiento =
    studentDetails?.fecha_nacimiento || "No especificado";
  const userSobreMi =
    studentDetails?.sobremi || "No hay informaci��n disponible";
  const userGithub = studentDetails?.github || "No especificado";
  const userLenguajes = studentDetails?.lenguajes || "No especificado";
  const userPais = studentDetails?.pais || "No especificado";
  const userProvincia = studentDetails?.provincia || "No especificado";
  const userTelefono = studentDetails?.telefono || "No especificado";
  const userX = studentDetails?.X || "No especificado";
  const userReddit = studentDetails?.Reddit || "No especificado";
  const userContratado = studentDetails?.contratado === 1 ? "Sí" : "No";

  return (
    <div
      className={`profile-student-container ${isReadOnly ? "profile-student-readonly" : ""}`}
    >
      {/* Sidebar - only show if not in read-only mode */}
      {!isReadOnly && <StudentSidebar activeSection="profile" />}

      {/* Main Content */}
      <main className="student-dashboard-main">
        {/* Top Navigation */}
        <header className="student-dashboard-header">
          <h1>{isReadOnly ? "Perfil del Estudiante" : "Mi Perfil"}</h1>
          <button
            className="student-btn-return"
            onClick={() => {
              if (isReadOnly) {
                const fromPage = location.state?.from;
                if (fromPage === "postulaciones") {
                  // Return to Stage 2 (student list) of postulaciones
                  navigate("/postulaciones", { state: { returnToStage2: true } });
                } else {
                  navigate(-1);
                }
              } else {
                handleLogoClick();
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
                  style={getAvatarStyles(userName, 140)}
                >
                  {getInitials(userName)}
                </div>
                <div className="student-profile-details">
                  <h2 className="student-profile-name">{userName}</h2>
                  <div className="student-profile-location">
                    <HiLocationMarker />
                    <span>{userPais}, {userProvincia}</span>
                  </div>
                  <div className="student-profile-status">
                    <HiFlag />
                    <span>Contratado: {userContratado}</span>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="student-profile-actions">
                    <button className="student-btn-edit-profile" onClick={() => navigate("/profile-student", { state: { readOnly: true } })}>
                      <HiEye />
                      Vista Pública
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* About Me */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Sobre mi</h3>
                {!isReadOnly && (
                  <button
                    className="student-add-btn"
                    onClick={() => handleEdit('sobremi')}
                    disabled={editingField === 'sobremi'}
                  >
                    <HiPencil />
                  </button>
                )}
              </div>
              <div className="student-card-content">
                {editingField === 'sobremi' ? (
                  <div className="edit-container">
                    <textarea
                      value={editForm.sobremi || ''}
                      onChange={(e) => handleInputChange('sobremi', e.target.value)}
                      className="edit-textarea"
                      rows="4"
                      placeholder="Descripción sobre ti"
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
                        onClick={() => handleSave('sobremi')}
                        className="save-btn"
                        disabled={saving}
                      >
                        <HiSave />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{userSobreMi}</p>
                )}
              </div>
            </section>

            {/* Experience */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Experiencias</h3>
              </div>
              <PaginatedItems
                items={experiences}
                renderItem={(experience, onDelete) => (
                  <ExperienceItem
                    experience={experience}
                    isReadOnly={isReadOnly}
                    onUpdate={handleUpdateExperience}
                    onDelete={onDelete}
                  />
                )}
                onAdd={handleAddExperience}
                onDelete={handleDeleteExperience}
                isReadOnly={isReadOnly}
                loading={experiencesLoading}
                emptyMessage="No tienes experiencias registradas. ¡Agrega tu primera experiencia!"
                addingText="Agregando..."
                addText="Agregar"
                className="experiences-pagination"
              />
            </section>

            {/* Education */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Educación</h3>
              </div>
              <PaginatedItems
                items={education}
                renderItem={(educationItem, onDelete) => (
                  <EducationItem
                    education={educationItem}
                    isReadOnly={isReadOnly}
                    onUpdate={handleUpdateEducation}
                    onDelete={onDelete}
                  />
                )}
                onAdd={handleAddEducation}
                onDelete={handleDeleteEducation}
                isReadOnly={isReadOnly}
                loading={educationLoading}
                emptyMessage="No tienes educación registrada. ¡Agrega tu primera institución!"
                addingText="Agregando..."
                addText="Agregar"
                className="education-pagination"
              />
            </section>

            {/* Skills */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Habilidades</h3>
                {!isReadOnly && (
                  <button className="student-add-btn">
                    <HiPlus />
                  </button>
                )}
              </div>
              <div className="student-skills-grid">
                <span className="student-skill-tag">Comunicación</span>
                <span className="student-skill-tag">Análisis</span>
                <span className="student-skill-tag">Control de Versiones</span>
                <span className="student-skill-tag">Cloud</span>
                <span className="student-skill-tag">
                  Frameworks/Librerías Frontend
                </span>
              </div>
            </section>

            {/* Portfolio */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Portafolio</h3>
                {!isReadOnly && (
                  <button className="student-add-btn">
                    <HiPlus />
                  </button>
                )}
              </div>
              <div className="student-portfolio-empty">
                <div className="student-empty-icon">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7dd8ec8b50261b5ad8f7c227df01189ccd7316c?width=158"
                    alt="No projects"
                  />
                </div>
                <p>No se ha subido ningún proyecto</p>
              </div>
              <div className="student-progress-bar">
                <div className="student-progress-fill"></div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="student-sidebar-right">
            {/* Contact Details */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Detalles Adicionales</h3>
              </div>
              <div className="student-contact-list">
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiMail />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Email</div>
                    <div className="student-contact-value">{userEmail}</div>
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiIdentification />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Cédula</div>
                    {editingField === 'cedula' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.cedula || ''}
                          onChange={(e) => handleInputChange('cedula', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Número de cédula"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('cedula')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{userCedula}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('cedula')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiTranslate />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">
                      Lenguajes de Programación
                    </div>
                    {editingField === 'lenguajes' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.lenguajes || ''}
                          onChange={(e) => handleInputChange('lenguajes', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Lenguajes de programación"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('lenguajes')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{userLenguajes}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('lenguajes')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiFlag />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">País</div>
                    {editingField === 'pais' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.pais || ''}
                          onChange={(e) => handleInputChange('pais', e.target.value)}
                          className="inline-edit-input"
                          placeholder="País"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('pais')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{userPais}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('pais')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiLocationMarker />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Provincia</div>
                    {editingField === 'provincia' ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          value={editForm.provincia || ''}
                          onChange={(e) => handleInputChange('provincia', e.target.value)}
                          className="inline-edit-input"
                          placeholder="Provincia"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('provincia')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">{userProvincia}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('provincia')} className="inline-edit-btn">
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
                        <div className="student-contact-value">{userTelefono}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('telefono')} className="inline-edit-btn">
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
                    <div className="student-contact-label">
                      Fecha de Nacimiento
                    </div>
                    {editingField === 'fecha_nacimiento' ? (
                      <div className="inline-edit-container">
                        <input
                          type="date"
                          value={editForm.fecha_nacimiento ? editForm.fecha_nacimiento.split('T')[0] : ''}
                          onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                          className="inline-edit-input"
                        />
                        <div className="inline-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('fecha_nacimiento')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="editable-value">
                        <div className="student-contact-value">
                          {userFechaNacimiento
                            ? new Date(userFechaNacimiento).toLocaleDateString()
                            : "No especificado"}
                        </div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('fecha_nacimiento')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Enlaces</h3>
              </div>
              <div className="student-social-links">
                <div className="student-social-item">
                  <div className="student-social-icon">
                    <FaGithub />
                  </div>
                  <div className="student-social-content">
                    <div className="student-social-label">Github</div>
                    {editingField === 'github' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.github || ''}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de GitHub"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('github')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        <div className="student-social-value">
                          {userGithub || "No especificado"}
                        </div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('github')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-social-item">
                  <div className="student-social-icon">
                    <FaTwitter />
                  </div>
                  <div className="student-social-content">
                    <div className="student-social-label">X</div>
                    {editingField === 'X' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.X || ''}
                          onChange={(e) => handleInputChange('X', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de X/Twitter"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('X')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        <div className="student-social-value">{userX}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('X')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="student-social-item">
                  <div className="student-social-icon">
                    <FaReddit />
                  </div>
                  <div className="student-social-content">
                    <div className="student-social-label">Reddit</div>
                    {editingField === 'Reddit' ? (
                      <div className="contact-edit-container">
                        <input
                          type="url"
                          value={editForm.Reddit || ''}
                          onChange={(e) => handleInputChange('Reddit', e.target.value)}
                          className="contact-edit-input"
                          placeholder="URL de Reddit"
                        />
                        <div className="contact-edit-actions">
                          <button onClick={handleCancelEdit} className="inline-cancel-btn" disabled={saving}>
                            <HiX />
                          </button>
                          <button onClick={() => handleSave('Reddit')} className="inline-save-btn" disabled={saving}>
                            <HiSave />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-value-container">
                        <div className="student-social-value">{userReddit}</div>
                        {!isReadOnly && (
                          <button onClick={() => handleEdit('Reddit')} className="inline-edit-btn">
                            <HiPencil />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Badges */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Badges</h3>
              </div>
              {badgesLoading ? (
                <div className="loading-badges">Cargando badges...</div>
              ) : (
                <div className="student-badges-grid">
                  {badges.length > 0 ? (
                    badges.map((badge, index) => (
                      <div key={index} className={`student-badge ${badge.tipo || 'default'}`}>
                        {badge.nombre || badge.title || 'Badge'}
                      </div>
                    ))
                  ) : (
                    <div className="no-badges">No hay badges disponibles</div>
                  )}
                </div>
              )}
            </section>

            {/* CV Download */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>CV</h3>
              </div>
              <button className="student-download-cv-btn">
                <HiDownload />
                Descargar CV
              </button>
            </section>
          </aside>
        </div>
      </main>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSuccessMessage("");
        }}
        userDetails={studentDetails}
        userId={targetUserId}
        onSuccess={(updatedFields) => {
          // Mostrar mensaje de ��xito
          setSuccessMessage(`Campos actualizados: ${updatedFields.join(", ")}`);

          // Refrescar los datos del estudiante
          const fetchUpdatedDetails = async () => {
            try {
              const details = await ApiService.getStudentByUserId(targetUserId);
              setStudentDetails(details);
            } catch (error) {
              console.error("Error refreshing student details:", error);
            }
          };
          fetchUpdatedDetails();

          // Ocultar mensaje después de 3 segundos
          setTimeout(() => setSuccessMessage(""), 3000);
        }}
      />

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="success-notification">
          <span>✓ {successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileStudent;
