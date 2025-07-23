import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";
import "../assets/postulantes.css";

const Postulantes = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [studentBadges, setStudentBadges] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate();
  const applicantsPerPage = 6;

  // Create stable reference for studentBadges to prevent dependency array size changes
  const stableStudentBadges = useMemo(
    () => studentBadges || {},
    [studentBadges],
  );

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log("Postulantes: Timeout reached, forcing loading to false");
      setLoading(false);
    }, 10000);

    const fetchApplicants = async () => {
      console.log("Postulantes: User object:", user);
      console.log("Postulantes: User ID:", user?.id);
      console.log("Postulantes: User type:", user?.userType);
      console.log(
        "Postulantes: Is company user:",
        user?.userType === "empresas",
      );
      if (!user?.id || user?.userType !== "empresas") {
        console.log("Postulantes: No company user ID, returning early");
        setLoading(false);
        clearTimeout(timeout);
        return;
      }

      setLoading(true);
      try {
        // First get the company data to get the company id (id_empresa)
        const companyData = await apiService.getCompanyByUserId(user.id);
        console.log("Postulantes: Company data:", companyData);

        if (!companyData?.id) {
          console.log("Postulantes: No company id found");
          setLoading(false);
          clearTimeout(timeout);
          return;
        }

        // Use the company id (id_empresa) instead of user id (id_usuario)
        const data = await apiService.getCompanyApplicants(companyData.id);
        console.log(
          "Postulantes: Data received:",
          data?.length ? `${data.length} applicants` : "No applicants",
        );
        setApplicants(data);
        setFilteredApplicants(data);

        // Fetch badges for all students
        const badgesPromises = data.map(async (applicant) => {
          if (applicant.id_usuario) {
            const badges = await apiService.getStudentBadges(
              applicant.id_usuario,
            );
            return { [applicant.id_usuario]: badges };
          }
          return {};
        });

        const badgesResults = await Promise.all(badgesPromises);
        const badgesMap = badgesResults.reduce(
          (acc, badgeObj) => ({ ...acc, ...badgeObj }),
          {},
        );
        setStudentBadges(badgesMap);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        console.log("Postulantes: Setting loading to false");
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchApplicants();

    return () => clearTimeout(timeout);
  }, [user]);

  useEffect(() => {
    let filtered = applicants;

    if (searchTerm) {
      filtered = filtered.filter((applicant) => {
        // Search by name
        const nameMatch = applicant.nombre_completo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const countryMatch = applicant.pais
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        // Search by badges
        const badges = stableStudentBadges[applicant.id_usuario] || [];
        const badgeMatch = badges.some(
          (badge) =>
            badge.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        return nameMatch || countryMatch || badgeMatch;
      });
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.pais?.toLowerCase() === locationFilter.toLowerCase(),
      );
    }

    setFilteredApplicants(filtered);
    setCurrentPage(1);
  }, [searchTerm, locationFilter, applicants, stableStudentBadges]);

  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);
  const currentApplicants = filteredApplicants.slice(
    (currentPage - 1) * applicantsPerPage,
    currentPage * applicantsPerPage,
  );

  console.log(
    "Postulantes: Rendering -",
    currentApplicants.length,
    "applicants on page",
    currentPage,
    "of",
    totalPages,
  );

  const handleViewProfile = (applicant) => {
    navigate(`/profile-student/${applicant.id_usuario}`, {
      state: { readOnly: true },
    });
  };

  // Generate random avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "#0a5cb8", // Project blue
      "#1e40af", // Blue 700
      "#059669", // Emerald 600
      "#dc2626", // Red 600
      "#7c3aed", // Violet 600
      "#ea580c", // Orange 600
      "#0891b2", // Cyan 600
      "#65a30d", // Lime 600
    ];

    const index = name?.length ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (nombreCompleto) => {
    if (!nombreCompleto) return "U";
    const parts = nombreCompleto.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
    const secondInitial = parts[1]?.charAt(0).toUpperCase() || "";
    return firstInitial + secondInitial || "U";
  };

  const locations = [
    ...new Set(applicants.map((app) => app.ubicacion).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="postulantes-container">
        <div className="loading-state">Cargando postulantes...</div>
      </div>
    );
  }

  return (
    <div className="postulantes-container">
      <div className="postulantes-header">
        <h1 className="postulantes-title">Postulantes</h1>
        <p className="postulantes-subtitle">
          Encuentra a los mejores candidatos para tu empresa
        </p>
      </div>

      <div className="search-filters-section">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o carrera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="location-filter-wrapper">
          <FiMapPin className="location-icon" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="location-select"
          >
            <option value="">Todas las ubicaciones</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <FiChevronDown className="select-arrow" />
        </div>
      </div>

      <div className="applicants-grid">
        {currentApplicants.length > 0 ? (
          currentApplicants.map((applicant) => (
            <div key={applicant.id_usuario} className="applicant-card">
              <div className="applicant-image-wrapper">
                {applicant.foto_perfil ? (
                  <img
                    src={applicant.foto_perfil}
                    alt={`${applicant.nombre} ${applicant.apellido}`}
                    className="applicant-image"
                  />
                ) : (
                  <div
                    className="applicant-image-default"
                    style={{
                      backgroundColor: getAvatarColor(
                        applicant.nombre_completo,
                      ),
                    }}
                  >
                    {getInitials(applicant.nombre_completo)}
                  </div>
                )}
              </div>

              <div className="applicant-info">
                <h3 className="applicant-name">{applicant.nombre_completo}</h3>

                <div className="applicant-location">
                  <FiMapPin className="location-icon-small" />
                  <span>{applicant.pais || "Ubicación no especificada"}</span>
                </div>

                <div className="applicant-badges">
                  {stableStudentBadges[applicant.id_usuario]
                    ?.slice(0, 3)
                    .map((badge, index) => (
                      <span key={index} className="skill-badge">
                        {badge.nombre || badge.descripcion}
                      </span>
                    ))}
                  {stableStudentBadges[applicant.id_usuario]?.length > 3 && (
                    <span className="skill-badge more-badges">
                      +{stableStudentBadges[applicant.id_usuario].length - 3}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleViewProfile(applicant)}
                className="view-profile-btn"
              >
                Ver perfil
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron postulantes que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>

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
  );
};

export default Postulantes;
