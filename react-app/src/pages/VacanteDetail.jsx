import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiMapPin, 
  FiCalendar, 
  FiBriefcase, 
  FiEdit, 
  FiSave, 
  FiX, 
  FiArrowLeft,
  FiUser,
  FiFileText,
  FiTarget,
  FiAward
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";
import "../assets/vacante-detail.css";

const VacanteDetail = () => {
  const { vacanteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [isPostulado, setIsPostulado] = useState(false);
  const [checkingPostulado, setCheckingPostulado] = useState(false);

  // Obtener datos del usuario actual
  useEffect(() => {
    const getCurrentUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        if (user?.userType === "postulantes") {
          const studentData = await apiService.getStudentByUserId(user.id);
          setCurrentUser({ ...studentData, userType: "student" });
        } else if (user?.userType === "empresas") {
          const companyData = await apiService.getCompanyByUserId(user.id);
          setCurrentUser({ ...companyData, userType: "company" });
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    getCurrentUserData();
  }, [user?.id, user?.userType]);

  // Obtener detalles de la vacante
  useEffect(() => {
    const fetchVacanteDetail = async () => {
      if (!vacanteId) {
        console.log("No vacanteId provided");
        setLoading(false);
        return;
      }

      console.log("Fetching vacante detail for ID:", vacanteId);
      console.log("Current user:", currentUser);

      try {
        const response = await apiService.getVacanteById(parseInt(vacanteId));
        console.log("Vacante detail response:", response);

        if (response && response.estado === 1 && response.data) {
          console.log("Setting vacante data:", response.data);
          setVacante(response.data);
          setEditForm({
            titulo: response.data.titulo || "",
            descripcion: response.data.descripcion || "",
            ubicacion: response.data.ubicacion || "",
            responsabilidades: response.data.responsabilidades || "",
            requisitos: response.data.requisitos || "",
            beneficios: response.data.beneficios || ""
          });
        } else {
          console.log("No vacante found or invalid response:", response);
        }
      } catch (error) {
        console.error("Error fetching vacante detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacanteDetail();
  }, [vacanteId]);

  // Function to handle back navigation
  const handleBackNavigation = () => {
    const fromPage = location.state?.from;

    if (fromPage === "vacantes-aplicadas") {
      navigate("/vacantes-aplicadas");
    } else if (fromPage === "vacantes") {
      navigate("/vacantes");
    } else {
      // Default fallback based on user type
      if (currentUser?.userType === "student") {
        navigate("/vacantes");
      } else if (currentUser?.userType === "company") {
        navigate("/postulaciones");
      } else {
        navigate("/");
      }
    }
  };

  // Check if user has already applied to this vacancy
  useEffect(() => {
    const checkPostulacionStatus = async () => {
      if (!currentUser?.id || currentUser?.userType !== "student" || !vacanteId) {
        return;
      }

      setCheckingPostulado(true);
      try {
        // Get all vacantes applied by this student and check if this one is included
        const vacantesAplicadas = await apiService.getStudentAppliedVacantes(currentUser.id);
        const hasApplied = vacantesAplicadas.some(v =>
          (v.id_vacante && v.id_vacante.toString() === vacanteId) ||
          (v.id && v.id.toString() === vacanteId)
        );
        setIsPostulado(hasApplied);
      } catch (error) {
        console.error("Error checking postulacion status:", error);
      } finally {
        setCheckingPostulado(false);
      }
    };

    checkPostulacionStatus();
  }, [currentUser?.id, currentUser?.userType, vacanteId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "UN";
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      titulo: vacante.titulo || "",
      descripcion: vacante.descripcion || "",
      ubicacion: vacante.ubicacion || "",
      responsabilidades: vacante.responsabilidades || "",
      requisitos: vacante.requisitos || "",
      beneficios: vacante.beneficios || ""
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determinar qué campos han cambiado
      const changedFields = [];
      Object.keys(editForm).forEach(field => {
        if (editForm[field] !== (vacante[field] || "")) {
          changedFields.push({ campo: field, valor: editForm[field] });
        }
      });

      // Actualizar cada campo que ha cambiado
      for (const change of changedFields) {
        await apiService.updateVacante(vacante.id_vacante, change.campo, change.valor);
      }

      // Actualizar el estado local
      setVacante(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      
      alert("Vacante actualizada exitosamente");
    } catch (error) {
      console.error("Error updating vacante:", error);
      alert("Error al actualizar la vacante. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePostular = async () => {
    if (!user?.id || !vacante?.id_vacante) {
      alert("Error: No se pudo obtener la información necesaria");
      return;
    }

    if (isPostulado) {
      alert("Ya te has postulado a esta vacante");
      return;
    }

    try {
      await apiService.postularVacante(user.id, vacante.id_vacante);
      alert("¡Postulación enviada exitosamente!");

      // Actualizar el estado local
      setIsPostulado(true);
    } catch (error) {
      console.error("Error applying to vacante:", error);
      alert("Error al postularse. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="vacante-detail-container">
        <div className="loading-state">Cargando detalles de la vacante...</div>
      </div>
    );
  }

  if (!vacante) {
    return (
      <div className="vacante-detail-container">
        <div className="error-state">
          <h2>Vacante no encontrada</h2>
          <p>Lo sentimos, no pudimos encontrar esta vacante.</p>
          <button onClick={handleBackNavigation} className="back-btn">
            <FiArrowLeft /> Volver
          </button>
        </div>
      </div>
    );
  }

  const canEdit = currentUser?.userType === "company" && currentUser?.id === vacante?.id_empresa;

  return (
    <div className="vacante-detail-container">
      {/* Header con navegación */}
      <div className="detail-header">
        <button onClick={handleBackNavigation} className="back-button">
          <FiArrowLeft />
          <span>Volver</span>
        </button>
        
        {canEdit && (
          <div className="header-actions">
            {!isEditing ? (
              <button onClick={handleEdit} className="edit-button">
                <FiEdit />
                <span>Editar Vacante</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  onClick={handleCancelEdit} 
                  className="cancel-button"
                  disabled={saving}
                >
                  <FiX />
                  <span>Cancelar</span>
                </button>
                <button 
                  onClick={handleSave} 
                  className="save-button"
                  disabled={saving}
                >
                  <FiSave />
                  <span>{saving ? "Guardando..." : "Guardar"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="detail-content">
        {/* Información de la empresa */}
        <div className="company-section">
          <div className="company-avatar">
            {getInitials(vacante.nombre_empresa)}
          </div>
          <div className="company-info">
            <h2 className="company-name">{vacante.nombre_empresa}</h2>
            <div className="company-meta">
              <FiBriefcase className="icon" />
              <span>Empresa</span>
            </div>
          </div>
        </div>

        {/* Título y información básica */}
        <div className="vacante-main-info">
          {isEditing ? (
            <input
              type="text"
              value={editForm.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              className="edit-title-input"
              placeholder="Título de la vacante"
            />
          ) : (
            <h1 className="vacante-title">{vacante.titulo}</h1>
          )}
          
          <div className="vacante-meta">
            <div className="meta-item">
              <FiMapPin className="icon" />
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.ubicacion}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                  className="edit-input"
                  placeholder="Ubicación"
                />
              ) : (
                <span>{vacante.ubicacion}</span>
              )}
            </div>
            
            <div className="meta-item">
              <FiCalendar className="icon" />
              <span>Publicado: {formatDate(vacante.fecha_publicacion)}</span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="detail-section">
          <div className="section-header">
            <FiFileText className="section-icon" />
            <h3>Descripción del Puesto</h3>
          </div>
          <div className="section-content">
            {isEditing ? (
              <textarea
                value={editForm.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                className="edit-textarea"
                placeholder="Descripción del puesto"
                rows="4"
              />
            ) : (
              <p>{vacante.descripcion}</p>
            )}
          </div>
        </div>

        {/* Responsabilidades */}
        <div className="detail-section">
          <div className="section-header">
            <FiTarget className="section-icon" />
            <h3>Responsabilidades</h3>
          </div>
          <div className="section-content">
            {isEditing ? (
              <textarea
                value={editForm.responsabilidades}
                onChange={(e) => handleInputChange("responsabilidades", e.target.value)}
                className="edit-textarea"
                placeholder="Responsabilidades del puesto"
                rows="4"
              />
            ) : (
              <p>{vacante.responsabilidades || "No especificado"}</p>
            )}
          </div>
        </div>

        {/* Requisitos */}
        <div className="detail-section">
          <div className="section-header">
            <FiUser className="section-icon" />
            <h3>Requisitos</h3>
          </div>
          <div className="section-content">
            {isEditing ? (
              <textarea
                value={editForm.requisitos}
                onChange={(e) => handleInputChange("requisitos", e.target.value)}
                className="edit-textarea"
                placeholder="Requisitos del puesto"
                rows="4"
              />
            ) : (
              <p>{vacante.requisitos || "No especificado"}</p>
            )}
          </div>
        </div>

        {/* Beneficios */}
        <div className="detail-section">
          <div className="section-header">
            <FiAward className="section-icon" />
            <h3>Beneficios</h3>
          </div>
          <div className="section-content">
            {isEditing ? (
              <textarea
                value={editForm.beneficios}
                onChange={(e) => handleInputChange("beneficios", e.target.value)}
                className="edit-textarea"
                placeholder="Beneficios del puesto"
                rows="4"
              />
            ) : (
              <p>{vacante.beneficios || "No especificado"}</p>
            )}
          </div>
        </div>

        {/* Botón de postulación para estudiantes */}
        {currentUser?.userType === "student" && !isEditing && (
          <div className="apply-section">
            {checkingPostulado ? (
              <button className="checking-button" disabled>
                Verificando estado...
              </button>
            ) : isPostulado ? (
              <button className="applied-button" disabled>
                Ya postulado
              </button>
            ) : (
              <button onClick={handlePostular} className="apply-button">
                <FiBriefcase />
                <span>Postularme a esta vacante</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanteDetail;
