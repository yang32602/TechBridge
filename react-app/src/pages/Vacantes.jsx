import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiMapPin, FiTrash2, FiPlus, FiCalendar, FiBriefcase, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../assets/vacantes.css";

const Vacantes = () => {
  const [vacantes, setVacantes] = useState([]);
  const [filteredVacantes, setFilteredVacantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const vacantesPerPage = 6;

  // Form state for creating new vacante
  const [newVacante, setNewVacante] = useState({
    titulo: "",
    descripcion: "",
    ubicacion: "",
  });

  const { user } = useAuth();

  // Get current user data
  useEffect(() => {
    const getCurrentUserData = async () => {
      console.log("Vacantes: Getting current user data, user:", user);
      if (!user?.id) {
        console.log("Vacantes: No user ID, setting loading to false");
        setLoading(false);
        return;
      }

      try {
        if (user?.userType === "postulantes") {
          console.log("Vacantes: Fetching student data");
          const studentData = await apiService.getStudentByUserId(user.id);
          console.log("Vacantes: Student data:", studentData);
          setCurrentUser({ ...studentData, userType: "student" });
        } else if (user?.userType === "empresas") {
          console.log("Vacantes: Fetching company data");
          const companyData = await apiService.getCompanyByUserId(user.id_empresa || user.id);
          console.log("Vacantes: Company data:", companyData);
          setCurrentUser({ ...companyData, userType: "company" });
        } else {
          console.log("Vacantes: Unknown user type:", user?.userType);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
        setLoading(false);
      }
    };

    getCurrentUserData();
  }, [user?.id, user?.userType]);

  // Fetch vacantes based on user type
  useEffect(() => {
    const fetchVacantes = async () => {
      console.log("Vacantes: fetchVacantes called, currentUser:", currentUser, "user:", user);

      // Wait for both user and currentUser to be loaded
      if (!currentUser?.id || !currentUser?.userType || !user?.id) {
        console.log("Vacantes: Not ready to fetch, missing data");
        return;
      }

      console.log("Vacantes: Starting fetch with currentUser type:", currentUser.userType);
      setLoading(true);
      try {
        let vacantesData = [];

        if (currentUser.userType === "student") {
          console.log("Vacantes: Fetching vacantes for student");
          vacantesData = await apiService.getVacantesForStudent(user?.id);
        } else if (currentUser.userType === "company") {
          console.log("Vacantes: Fetching vacantes for company with id:", currentUser.id);
          vacantesData = await apiService.getVacantesForCompany(currentUser.id);
          console.log("Vacantes: Received vacantes data:", vacantesData);
        }

        console.log("Vacantes: Fetched vacantesData:", vacantesData);
        setVacantes(vacantesData);
        setFilteredVacantes(vacantesData);
      } catch (error) {
        console.error("Error fetching vacantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacantes();
  }, [currentUser?.id, currentUser?.userType, user?.id]);


  // Filter vacantes for students (search functionality)
  useEffect(() => {
    if (currentUser?.userType !== "student") {
      setFilteredVacantes(vacantes);
      return;
    }

    let filtered = vacantes;

    if (searchTerm) {
      filtered = filtered.filter((vacante) => {
        const tituloMatch = vacante.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
        const descripcionMatch = vacante.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        const empresaMatch = vacante.nombre_empresa?.toLowerCase().includes(searchTerm.toLowerCase());
        const ubicacionMatch = vacante.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());

        return tituloMatch || descripcionMatch || empresaMatch || ubicacionMatch;
      });
    }

    setFilteredVacantes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, vacantes, currentUser?.userType]);

  const handlePostular = async (vacante) => {
    if (!user?.id) {
      alert("Error: No se pudo obtener la información del usuario");
      return;
    }

    try {
      await apiService.postularVacante(user.id, vacante.id);

      // Update local state
      setVacantes(prev => prev.map(v =>
        v.id === vacante.id ? { ...v, postulado: 1 } : v
      ));
    } catch (error) {
      console.error("Error applying to vacante:", error);
      alert("Error al postularse. Inténtalo de nuevo.");
    }
  };

  const handleCreateVacante = async (e) => {
    e.preventDefault();
    if (!newVacante.titulo || !newVacante.descripcion || !newVacante.ubicacion) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!currentUser?.id) {
      alert("Error: No se pudo obtener la información de la empresa");
      return;
    }

    try {
      await apiService.createVacante(
        currentUser.id,
        newVacante.titulo,
        newVacante.descripcion,
        newVacante.ubicacion
      );

      // Reset form and refresh vacantes
      setNewVacante({ titulo: "", descripcion: "", ubicacion: "" });
      setShowCreateForm(false);

      // Refresh vacantes list
      if (currentUser?.id) {
        const vacantesActualizadas = await apiService.getVacantesForCompany(currentUser.id);
        setVacantes(vacantesActualizadas);
        setFilteredVacantes(vacantesActualizadas);
      }
    } catch (error) {
      console.error("Error creating vacante:", error);
      alert("Error al crear la vacante. Inténtalo de nuevo.");
    }
  };

  const handleVacanteClick = (vacanteId) => {
    console.log("Navigating to vacante with ID:", vacanteId);
    navigate(`/vacante/${vacanteId}`, {
      state: { from: "vacantes" }
    });
  };

  const handleDeleteVacante = async (idVacante) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta vacante?")) {
      return;
    }

    try {
      await apiService.deleteVacante(idVacante);

      // Remove from local state
      setVacantes(prev => prev.filter(v => v.id_vacante !== idVacante));
      setFilteredVacantes(prev => prev.filter(v => v.id_vacante !== idVacante));
    } catch (error) {
      console.error("Error deleting vacante:", error);
      alert("Error al eliminar la vacante. Inténtalo de nuevo.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  console.log("Vacantes render: loading =", loading, "currentUser =", currentUser);
  console.log("Vacantes render: vacantes =", vacantes, "filteredVacantes =", filteredVacantes);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVacantes.length / vacantesPerPage);
  const currentVacantes = filteredVacantes.slice(
    (currentPage - 1) * vacantesPerPage,
    currentPage * vacantesPerPage
  );

  if (loading || !currentUser) {
    return (
      <div className="vacantes-container">
        <div className="loading-state">Cargando vacantes...</div>
      </div>
    );
  }

  return (
    <div className="vacantes-container">
      <div className="vacantes-header">
        <h1 className="vacantes-title">
          {currentUser?.userType === "student" ? "Vacantes Disponibles" : "Mis Vacantes"}
        </h1>
        <p className="vacantes-subtitle">
          {currentUser?.userType === "student"
            ? "Encuentra oportunidades laborales que se adapten a tu perfil"
            : "Gestiona las vacantes de tu empresa"
          }
        </p>
      </div>

      {/* Search section for students only */}
      {currentUser?.userType === "student" && (
        <div className="search-filters-section">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por empresa, título, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Create button for companies */}
      {currentUser?.userType === "company" && (
        <div className="actions-section">
          <button
            onClick={() => setShowCreateForm(true)}
            className="create-vacante-btn"
          >
            <FiPlus className="icon" />
            Crear Nueva Vacante
          </button>
        </div>
      )}

      {/* Create form modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Crear Nueva Vacante</h3>
            <form onSubmit={handleCreateVacante}>
              <div className="form-group">
                <label>Título de la vacante</label>
                <input
                  type="text"
                  value={newVacante.titulo}
                  onChange={(e) => setNewVacante({ ...newVacante, titulo: e.target.value })}
                  placeholder="Ej: Desarrollador Frontend"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newVacante.descripcion}
                  onChange={(e) => setNewVacante({ ...newVacante, descripcion: e.target.value })}
                  placeholder="Describe los requisitos y responsabilidades..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  value={newVacante.ubicacion}
                  onChange={(e) => setNewVacante({ ...newVacante, ubicacion: e.target.value })}
                  placeholder="Ej: Ciudad de Panamá"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Crear Vacante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vacantes grid */}
      <div className="vacantes-grid">
        {currentVacantes.length > 0 ? (
          currentVacantes.map((vacante) => (
            <div
              key={vacante.id_vacante || vacante.id}
              className="vacante-card"
              onClick={() => handleVacanteClick(vacante.id_vacante || vacante.id)}
            >
              <div className="vacante-header">
                <h3 className="vacante-title">{vacante.titulo}</h3>
                {currentUser?.userType === "company" && (
                  <div className="vacante-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVacante(vacante.id_vacante);
                      }}
                      className="action-btn delete-btn"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
                <div className="view-details">
                  <FiArrowRight className="view-details-icon" />
                </div>
              </div>

              {currentUser?.userType === "student" && (
                <div className="company-info">
                  <FiBriefcase className="icon" />
                  <span
                    className="company-name clickable-company"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Vacantes: Navigating to empresa-perfil with id_empresa:", vacante.id_empresa);
                      console.log("Vacantes: Full vacante object:", vacante);
                      navigate(`/empresa-perfil/${vacante.id_empresa}`, {
                        state: { readOnly: true, from: "vacantes" }
                      });
                    }}
                  >
                    {vacante.nombre_empresa}
                  </span>
                </div>
              )}

              <div className="vacante-location">
                <FiMapPin className="icon" />
                <span>{vacante.ubicacion}</span>
              </div>

              <p className="vacante-description">{vacante.descripcion}</p>

              <div className="vacante-date">
                <FiCalendar className="icon" />
                <span>Publicado: {formatDate(vacante.fecha_publicacion)}</span>
              </div>

              {currentUser?.userType === "student" && (
                <div className="vacante-footer">
                  {vacante.postulado === 1 ? (
                    <button
                      className="postulado-btn"
                      disabled
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ya postulado
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostular(vacante);
                      }}
                      className="postular-btn"
                    >
                      Postularse
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>
              {currentUser?.userType === "student"
                ? "No se encontraron vacantes que coincidan con tu búsqueda"
                : "No has creado ninguna vacante aún"
              }
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


    </div>
  );
};

export default Vacantes;
