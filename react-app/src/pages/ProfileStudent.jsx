import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ApiService from "../services/api";
import { StudentSidebar } from "../components";
import EditProfileModal from "../components/EditProfileModal";
import "../assets/profile-student.css";

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

  const handleLogoClick = () => {
    navigate("/");
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
    ? studentDetails?.email || "No especificado"
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
            onClick={() => (isReadOnly ? navigate(-1) : handleLogoClick())}
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
                <div className="student-profile-avatar">
                  <span className="student-avatar-initials">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="student-profile-details">
                  <h2 className="student-profile-name">{userName}</h2>
                  <div className="student-profile-location">
                    <HiLocationMarker />
                    <span>{userPais}</span>
                  </div>
                  <div className="student-profile-status">
                    <HiFlag />
                    <span>Contratado: {userContratado}</span>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    className="student-btn-edit-profile"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Editar Perfil
                  </button>
                )}
              </div>
            </section>

            {/* About Me */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Sobre mi</h3>
              </div>
              <div className="student-card-content">
                <p>{userSobreMi}</p>
              </div>
            </section>

            {/* Experience */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Experiencias</h3>
                {!isReadOnly && (
                  <button className="student-add-btn">
                    <HiPlus />
                  </button>
                )}
              </div>
              <div className="student-experience-list">
                <div className="student-experience-item">
                  <div className="student-company-logo twitter">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/9637c8cc87f774345a91608e82c2fb7107805656?width=160"
                      alt="Twitter"
                    />
                  </div>
                  <div className="student-experience-content">
                    <div className="student-experience-header">
                      <h4>Ingeniera de Software</h4>
                    </div>
                    <div className="student-experience-meta">
                      <span className="company">Twitter</span>
                      <span className="dot">•</span>
                      <span className="type">Full-Time</span>
                      <span className="dot">•</span>
                      <span className="duration">
                        Jun 2019 - Presente (1y 1m)
                      </span>
                    </div>
                    <div className="student-location">Manchester, UK</div>
                    <p className="student-description">
                      Contribución activa en el desarrollo frontend y la
                      arquitectura de componentes para nuevas características de
                      la plataforma, asegurando la consistencia y escalabilidad
                      de la UI/UX.
                    </p>
                  </div>
                </div>

                <div className="student-divider"></div>

                <div className="student-experience-item">
                  <div className="student-company-logo godaddy">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/373778f4ea3a7d85e05b7eb084d0e07932b27858?width=160"
                      alt="GoDaddy"
                    />
                  </div>
                  <div className="student-experience-content">
                    <div className="student-experience-header">
                      <h4>
                        Especialista en Diseño & Desarrollo de Interfaz (UI/UX)
                      </h4>
                    </div>
                    <div className="student-experience-meta">
                      <span className="company">GoDaddy</span>
                      <span className="dot">•</span>
                      <span className="type">Full-Time</span>
                      <span className="dot">•</span>
                      <span className="duration">Jun 2011 - May 2019 (8y)</span>
                    </div>
                    <div className="student-location">Manchester, UK</div>
                    <p className="student-description">
                      Desarrollo e implementación de funcionalidades clave para
                      plataformas digitales, incluyendo la creación de
                      componentes reutilizables y librer��as de UI que
                      impulsaron la eficiencia del desarrollo.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="student-content-card">
              <div className="student-card-header">
                <h3>Educación</h3>
                {!isReadOnly && (
                  <button className="student-add-btn">
                    <HiPlus />
                  </button>
                )}
              </div>
              <div className="student-divider"></div>
              <div className="student-education-list">
                <div className="student-education-item">
                  <div className="student-institution-logo">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a687d8a17f0a98911b8f028bbbc9a808e3e64dc?width=172"
                      alt="UTP"
                    />
                  </div>
                  <div className="student-education-content">
                    <div className="student-education-header">
                      <h4>Universidad Tecnológica de Panamá</h4>
                    </div>
                    <div className="student-degree">Diseño Gráfico</div>
                    <div className="student-duration">2005 - 2009</div>
                  </div>
                </div>
              </div>
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
                    <div className="student-contact-value">{userCedula}</div>
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
                    <div className="student-contact-value">{userLenguajes}</div>
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiFlag />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">País</div>
                    <div className="student-contact-value">{userPais}</div>
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiLocationMarker />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Provincia</div>
                    <div className="student-contact-value">{userProvincia}</div>
                  </div>
                </div>
                <div className="student-contact-item">
                  <div className="student-contact-icon">
                    <HiPhone />
                  </div>
                  <div className="student-contact-content">
                    <div className="student-contact-label">Teléfono</div>
                    <div className="student-contact-value">{userTelefono}</div>
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
                    <div className="student-contact-value">
                      {userFechaNacimiento
                        ? new Date(userFechaNacimiento).toLocaleDateString()
                        : "No especificado"}
                    </div>
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
                    <div className="student-social-value">
                      {userGithub || "No especificado"}
                    </div>
                  </div>
                </div>
                <div className="student-social-item">
                  <div className="student-social-icon">
                    <FaTwitter />
                  </div>
                  <div className="student-social-content">
                    <div className="student-social-label">X</div>
                    <div className="student-social-value">{userX}</div>
                  </div>
                </div>
                <div className="student-social-item">
                  <div className="student-social-icon">
                    <FaReddit />
                  </div>
                  <div className="student-social-content">
                    <div className="student-social-label">Reddit</div>
                    <div className="student-social-value">{userReddit}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Badges */}
            <section className="student-sidebar-card">
              <div className="student-card-header">
                <h3>Badges</h3>
              </div>
              <div className="student-badges-grid">
                <div className="student-badge js-advanced">Js Advanced</div>
                <div className="student-badge html-medium">Html Medium</div>
                <div className="student-badge react-hooked">React Hooked</div>
              </div>
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
          // Mostrar mensaje de éxito
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
