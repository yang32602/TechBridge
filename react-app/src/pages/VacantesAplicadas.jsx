import React, { useState, useEffect } from "react";
import { FiCalendar, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { StudentSidebar } from "../components";
import apiService from "../services/api";
import "../assets/vacantes-aplicadas.css";

const VacantesAplicadas = () => {
  const [vacantesAplicadas, setVacantesAplicadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const vacantesPerPage = 6;

  // Get current user data
  useEffect(() => {
    const getCurrentUserData = async () => {
      if (!user?.id || user?.userType !== "postulantes") {
        setLoading(false);
        return;
      }

      try {
        const studentData = await apiService.getStudentByUserId(user.id);
        setCurrentUser({ ...studentData, userType: "student" });
      } catch (error) {
        console.error("Error fetching current user data:", error);
        setLoading(false);
      }
    };

    getCurrentUserData();
  }, [user?.id, user?.userType]);

  // Fetch student's applied vacantes
  useEffect(() => {
    const fetchVacantesAplicadas = async () => {
      if (!currentUser?.id) {
        return;
      }

      setLoading(true);
      try {
        const vacantesData = await apiService.getStudentAppliedVacantes(currentUser.id);
        setVacantesAplicadas(vacantesData);
      } catch (error) {
        console.error("Error fetching applied vacantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacantesAplicadas();
  }, [currentUser?.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(vacantesAplicadas.length / vacantesPerPage);
  const currentVacantes = vacantesAplicadas.slice(
    (currentPage - 1) * vacantesPerPage,
    currentPage * vacantesPerPage
  );

  if (loading || !currentUser) {
    return (
      <div className="vacantes-aplicadas-container">
        <div className="loading-state">Cargando vacantes aplicadas...</div>
      </div>
    );
  }

  if (user?.userType !== "postulantes") {
    return (
      <div className="vacantes-aplicadas-container">
        <div className="error-state">Esta página es solo para estudiantes.</div>
      </div>
    );
  }

  return (
    <div className="vacantes-aplicadas-page">
      <StudentSidebar activeSection="recommended-jobs" />
      <div className="vacantes-aplicadas-container">
        <div className="vacantes-aplicadas-header">
        <h1 className="vacantes-aplicadas-title">Mis Postulaciones</h1>
        <p className="vacantes-aplicadas-subtitle">
          Revisa todas las vacantes a las que te has postulado
        </p>
      </div>

      <div className="vacantes-aplicadas-grid">
        {currentVacantes.length > 0 ? (
          currentVacantes.map((vacante) => (
            <div key={vacante.id_vacante} className="vacante-aplicada-card">
              <div className="vacante-aplicada-header">
                <h3 className="vacante-aplicada-title">{vacante.titulo}</h3>
              </div>

              <div className="company-info">
                <FiBriefcase className="icon" />
                <span className="company-name">{vacante.nombre_empresa}</span>
              </div>

              <div className="vacante-aplicada-location">
                <FiMapPin className="icon" />
                <span>{vacante.ubicacion}</span>
              </div>

              <p className="vacante-aplicada-description">{vacante.descripcion}</p>

              <div className="vacante-aplicada-date">
                <FiCalendar className="icon" />
                <span>Publicado: {formatDate(vacante.fecha_publicacion)}</span>
              </div>

              <div className="application-status">
                <span className="status-badge applied">Postulado</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No te has postulado a ninguna vacante aún</p>
            <p className="no-results-hint">
              Visita la página de <a href="/vacantes">Vacantes</a> para encontrar oportunidades laborales
            </p>
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
          >
            Anterior
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
          >
            Siguiente
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default VacantesAplicadas;
