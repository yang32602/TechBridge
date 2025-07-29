import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiMapPin, FiChevronDown, FiChevronLeft, FiChevronRight, FiUnlock, FiLock} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";
import "../assets/postulantes.css";

const Postulantes = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos"); // 新的状态筛选器
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [studentBadges, setStudentBadges] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [companyData, setCompanyData] = useState(null);
  const [unlockingStudents, setUnlockingStudents] = useState(new Set()); // 追踪正在解锁的学生

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
        const companyData = await apiService.getCompanyByUserId(user.id_empresa || user.id);
        console.log("Postulantes: Company data:", companyData);

        if (!companyData?.id) {
          console.log("Postulantes: No company id found");
          setLoading(false);
          clearTimeout(timeout);
          return;
        }

        setCompanyData(companyData);

        // Get company balance
        const balance = await apiService.getCompanyTechPoints(companyData.id);
        setUserBalance(balance);

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

    // 根据状态筛选
    if (statusFilter === "Desbloqueados") {
      filtered = filtered.filter(applicant => applicant.desbloqueado !== null);
    } else if (statusFilter === "No desbloqueados") {
      filtered = filtered.filter(applicant => applicant.desbloqueado === null);
    }

    setFilteredApplicants(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, applicants, stableStudentBadges]);

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

  const handleUnlockStudent = async (applicant) => {
    if (!companyData || userBalance < 50) {
      alert("Puntos insuficientes");
      navigate("/comprar-puntos");
      return;
    }

    if (unlockingStudents.has(applicant.id_usuario)) {
      return; // 正在解锁中，避免重复请求
    }

    setUnlockingStudents(prev => new Set(prev).add(applicant.id_usuario));

    try {
      console.log("Attempting to unlock student:", {
        companyId: companyData.id,
        studentId: applicant.id_usuario
      });

      // 先解锁学生，如果成功再扣除积分
      // 使用 applicant.id_estudiante 而不是 applicant.id_usuario，因为数据库关联的是estudiantes表的ID
      const studentId = applicant.id_estudiante || applicant.id_usuario;
      const unlockResponse = await apiService.unlockStudent(companyData.id, studentId);
      console.log("Unlock response:", unlockResponse);

      // 解锁成功后扣除积分
      const spendResponse = await apiService.spendPoints(companyData.id, 50);
      console.log("Spend points response:", spendResponse);

      // 更新余额
      setUserBalance(prev => prev - 50);

      // 重新获取申请者数据以确保从数据库获取最新的解锁状态
      try {
        const updatedData = await apiService.getCompanyApplicants(companyData.id);
        setApplicants(updatedData);
      } catch (refetchError) {
        console.error("Error refetching applicants after unlock:", refetchError);
        // 如果重新获取失败，至少更新本地状态
        const unlockedTimestamp = new Date().toISOString();
        setApplicants(prev =>
          prev.map(app =>
            app.id_usuario === applicant.id_usuario
              ? { ...app, desbloqueado: unlockedTimestamp }
              : app
          )
        );
      }

      // 添加解锁动画效果
      const cardElement = document.querySelector(`[data-student-id="${applicant.id_usuario}"]`);
      if (cardElement) {
        cardElement.classList.add('unlock-animation');
        setTimeout(() => {
          cardElement.classList.remove('unlock-animation');
        }, 600);
      }

      console.log("Student unlocked successfully:", applicant.id_usuario);

    } catch (error) {
      console.error("Error unlocking student:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        companyId: companyData.id,
        studentUserId: applicant.id_usuario,
        studentId: applicant.id_estudiante
      });

      // 提供更具体的错误信息
      let errorMessage = "Error al desbloquear el estudiante. Inténtalo de nuevo.";
      if (error.message && error.message.includes('fetch')) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.";
      } else if (error.message && error.message.includes('400')) {
        errorMessage = "Error en los datos enviados. Por favor contacta al soporte.";
      } else if (error.message && error.message.includes('500')) {
        errorMessage = "Error del servidor. Por favor inténtalo más tarde.";
      }

      alert(errorMessage);
    } finally {
      setUnlockingStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicant.id_usuario);
        return newSet;
      });
    }
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
        <div className="header-top">
          <div className="header-left">
            <h1 className="postulantes-title">Postulantes</h1>
            <p className="postulantes-subtitle">
              Encuentra a los mejores candidatos para tu empresa
            </p>
          </div>
          <div className="balance-display">
            <HiSparkles className="balance-icon" />
            <span>Balance Actual: {userBalance.toLocaleString()} TechPoints</span>
          </div>
        </div>
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

        <div className="status-filter-wrapper">
          <FiLock className="location-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="location-select"
          >
            <option value="Todos">Todos</option>
            <option value="Desbloqueados">Desbloqueados</option>
            <option value="No desbloqueados">No desbloqueados</option>
          </select>
          <FiChevronDown className="select-arrow" />
        </div>
      </div>

      <div className="applicants-grid">
        {currentApplicants.length > 0 ? (
          currentApplicants.map((applicant) => (
            <div
              key={applicant.id_usuario}
              data-student-id={applicant.id_usuario}
              className={`applicant-card ${applicant.desbloqueado === null ? 'locked' : 'unlocked'}`}
            >
              <div className="applicant-image-wrapper">
                {applicant.foto_perfil ? (
                  <img
                    src={applicant.foto_perfil}
                    alt={`${applicant.nombre} ${applicant.apellido}`}
                    className={`applicant-image ${applicant.desbloqueado === null ? 'blurred' : ''}`}
                  />
                ) : (
                  <div
                    className={`applicant-image-default ${applicant.desbloqueado === null ? 'blurred' : ''}`}
                    style={{
                      backgroundColor: getAvatarColor(
                        applicant.nombre_completo,
                      ),
                    }}
                  >
                    {getInitials(applicant.nombre_completo)}
                  </div>
                )}
                {applicant.desbloqueado === null && (
                  <div className="lock-overlay">
                    <FiLock className="lock-icon" />
                  </div>
                )}
              </div>

              <div className="applicant-info">
                <h3 className={`applicant-name ${applicant.desbloqueado === null ? 'blurred-text' : ''}`}>
                  {applicant.desbloqueado === null ? '••••••••••' : applicant.nombre_completo}
                </h3>

                <div className="applicant-location">
                  <FiMapPin className="location-icon-small" />
                  <span className={applicant.desbloqueado === null ? 'blurred-text' : ''}>
                    {applicant.desbloqueado === null ? '••••••••••' : (applicant.pais || "Ubicación no especificada")}
                  </span>
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

              {applicant.desbloqueado !== null ? (
                <button
                  onClick={() => handleViewProfile(applicant)}
                  className="view-profile-btn"
                >
                  Ver perfil
                </button>
              ) : (
                <button
                  onClick={() => handleUnlockStudent(applicant)}
                  className="unlock-btn"
                  disabled={unlockingStudents.has(applicant.id_usuario)}
                >
                  <FiUnlock className="unlock-icon" />
                  {unlockingStudents.has(applicant.id_usuario) ? "Desbloqueando..." : "Desbloquear (50 pts)"}
                </button>
              )}
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
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Postulantes;
