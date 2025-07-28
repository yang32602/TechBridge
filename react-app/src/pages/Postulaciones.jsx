import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiUser, FiMail, FiPhone, FiArrowLeft, FiCalendar, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CompanySidebar } from "../components";
import apiService from "../services/api";
import "../assets/postulaciones.css";

const Postulaciones = () => {
  const [vacantes, setVacantes] = useState([]);
  const [selectedVacante, setSelectedVacante] = useState(null);
  const [aplicantesVacante, setAplicantesVacante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAplicantes, setLoadingAplicantes] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldReturnToStage2, setShouldReturnToStage2] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const vacantesPerPage = 6;

  // Get current user data
  useEffect(() => {
    const getCurrentUserData = async () => {
      if (!user?.id || user?.userType !== "empresas") {
        setLoading(false);
        return;
      }

      try {
        const companyData = await apiService.getCompanyByUserId(user.id);
        setCurrentUser({ ...companyData, userType: "company" });
      } catch (error) {
        console.error("Error fetching current user data:", error);
        setLoading(false);
      }
    };

    getCurrentUserData();
  }, [user?.id, user?.userType]);

  // Check if should return to Stage 2 (from ProfileStudent)
  useEffect(() => {
    if (location.state?.returnToStage2 && currentUser?.id) {
      setShouldReturnToStage2(true);
      // Get the first vacante to show students automatically
      if (vacantes.length > 0) {
        handleVacanteClick(vacantes[0]);
      }
    }
  }, [location.state, currentUser?.id, vacantes]);

  // Fetch company's vacantes
  useEffect(() => {
    const fetchVacantes = async () => {
      if (!currentUser?.id) {
        return;
      }

      setLoading(true);
      try {
        const vacantesData = await apiService.getVacantesForCompany(currentUser.id);
        setVacantes(vacantesData);
      } catch (error) {
        console.error("Error fetching vacantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacantes();
  }, [currentUser?.id]);

  // Fetch students applied to selected vacante
  const handleVacanteClick = async (vacante) => {
    setSelectedVacante(vacante);
    setLoadingAplicantes(true);
    try {
      const estudiantesData = await apiService.getStudentsAppliedToVacante(vacante.id_vacante);
      setAplicantesVacante(estudiantesData);
    } catch (error) {
      console.error("Error fetching applied students:", error);
      setAplicantesVacante([]);
    } finally {
      setLoadingAplicantes(false);
    }
  };

  const handleViewProfile = (estudiante) => {
    navigate(`/profile-student/${estudiante.id_usuario}`, {
      state: { readOnly: true, from: "postulaciones" },
    });
  };

  const handleBackToVacantes = () => {
    setSelectedVacante(null);
    setAplicantesVacante([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(vacantes.length / vacantesPerPage);
  const currentVacantes = vacantes.slice(
    (currentPage - 1) * vacantesPerPage,
    currentPage * vacantesPerPage
  );

  if (loading || !currentUser) {
    return (
      <div className="postulaciones-container">
        <div className="loading-state">Cargando postulaciones...</div>
      </div>
    );
  }

  if (user?.userType !== "empresas") {
    return (
      <div className="postulaciones-container">
        <div className="error-state">Esta página es solo para empresas.</div>
      </div>
    );
  }

  return (
    <div className="postulaciones-page">
      <CompanySidebar activeSection="job-posts" />
      <div className="postulaciones-container">
        {!selectedVacante ? (
        // Stage 1: Show company's vacantes
        <>
          <div className="postulaciones-header">
            <h1 className="postulaciones-title">Postulaciones</h1>
            <p className="postulaciones-subtitle">
              Revisa las vacantes de tu empresa y los candidatos que se han postulado
            </p>
          </div>

          <div className="vacantes-grid">
            {currentVacantes.length > 0 ? (
              currentVacantes.map((vacante) => (
                <div 
                  key={vacante.id_vacante} 
                  className="vacante-card clickable"
                  onClick={() => handleVacanteClick(vacante)}
                >
                  <div className="vacante-header">
                    <h3 className="vacante-title">{vacante.titulo}</h3>
                    <div className="view-icon">
                      <FiChevronRight />
                    </div>
                  </div>

                  <div className="vacante-location">
                    <FiMapPin className="icon" />
                    <span>{vacante.ubicacion}</span>
                  </div>

                  <p className="vacante-description">{vacante.descripcion}</p>

                  <div className="vacante-date">
                    <FiCalendar className="icon" />
                    <span>Publicado: {formatDate(vacante.fecha_publicacion)}</span>
                  </div>

                  <div className="click-hint">
                    Haz clic para ver postulantes
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No has creado ninguna vacante aún</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
                title="Página anterior"
              >
                <FiChevronLeft />
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-btn"
                title="Página siguiente"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        // Stage 2: Show students applied to selected vacante
        <>
          <div className="aplicantes-header">
            <button 
              onClick={handleBackToVacantes}
              className="back-button"
            >
              <FiArrowLeft className="icon" />
              Volver a vacantes
            </button>
            <h1 className="aplicantes-title">
              Postulantes para: {selectedVacante.titulo}
            </h1>
            <p className="aplicantes-subtitle">
              {aplicantesVacante.length} estudiante{aplicantesVacante.length !== 1 ? 's' : ''} 
              {aplicantesVacante.length !== 1 ? ' se han postulado' : ' se ha postulado'} para esta vacante
            </p>
          </div>

          {loadingAplicantes ? (
            <div className="loading-state">Cargando postulantes...</div>
          ) : (
            <div className="aplicantes-grid">
              {aplicantesVacante.length > 0 ? (
                aplicantesVacante.map((estudiante) => (
                  <div key={estudiante.id_usuario} className="aplicante-card">
                    <div className="aplicante-info">
                      <div className="aplicante-name-section">
                        <FiUser className="icon" />
                        <h3 className="aplicante-name">{estudiante.nombre_completo}</h3>
                      </div>

                      <div className="aplicante-contact">
                        <div className="contact-item">
                          <FiMail className="icon" />
                          <span>{estudiante.correo}</span>
                        </div>
                        {estudiante.telefono && (
                          <div className="contact-item">
                            <FiPhone className="icon" />
                            <span>{estudiante.telefono}</span>
                          </div>
                        )}
                      </div>

                      {estudiante.nombre_empresa && (
                        <div className="empresa-info">
                          <FiBriefcase className="icon" />
                          <span>Empresa: {estudiante.nombre_empresa}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleViewProfile(estudiante)}
                      className="view-profile-btn"
                    >
                      Ver perfil
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>Ningún estudiante se ha postulado para esta vacante aún</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Postulaciones;
