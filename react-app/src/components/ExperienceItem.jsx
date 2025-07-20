import React, { useState } from "react";
import { HiPencil, HiSave, HiX, HiTrash } from "react-icons/hi";
import ApiService from "../services/api";

const ExperienceItem = ({ experience, isReadOnly, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState({});
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD for input
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Presente";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    setEditValues((prev) => ({
      ...prev,
      [field]: field.includes("fecha")
        ? formatDate(experience[field])
        : experience[field] || "",
    }));
  };

  const handleCancel = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setEditValues((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      await ApiService.updateStudentExperience(
        experience.id,
        field,
        editValues[field],
      );

      // Update the local experience data
      const updatedExperience = {
        ...experience,
        [field]: editValues[field],
      };

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      onUpdate && onUpdate(updatedExperience);
    } catch (error) {
      console.error("Error updating experience field:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      return;
    }

    setDeleting(true);
    try {
      await ApiService.deleteStudentExperience(experience.id);
      onDelete && onDelete(experience.id);
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (field, label, value, type = "text") => {
    const isFieldEditing = isEditing[field];

    if (isFieldEditing) {
      return (
        <div className="experience-field-edit">
          <label className="experience-field-label">{label}</label>
          <div className="experience-edit-controls">
            {type === "textarea" ? (
              <textarea
                value={editValues[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="experience-edit-input experience-edit-textarea"
                rows={3}
                disabled={loading}
              />
            ) : (
              <input
                type={type}
                value={editValues[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="experience-edit-input"
                disabled={loading}
              />
            )}
            <div className="experience-edit-buttons">
              <button
                onClick={() => handleSave(field)}
                className="experience-save-btn"
                disabled={loading}
              >
                <HiSave />
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="experience-cancel-btn"
                disabled={loading}
              >
                <HiX />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="experience-field">
        <label className="experience-field-label">{label}</label>
        <div className="experience-field-content">
          <span className="experience-field-value">
            {field.includes("fecha")
              ? formatDisplayDate(value)
              : value || "No especificado"}
          </span>
          {!isReadOnly && (
            <button
              onClick={() => handleEdit(field)}
              className="experience-edit-icon"
            >
              <HiPencil />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="student-experience-item">
      <div className="student-experience-content">
        {!isReadOnly && (
          <div className="experience-edit-header">
            <button
              onClick={handleDelete}
              className="experience-delete-btn"
              disabled={deleting}
            >
              <HiTrash className="experience-delete-icon" />
            </button>
          </div>
        )}

        {renderEditableField("tipo", "Tipo", experience.tipo)}
        {renderEditableField("titulo", "Título", experience.titulo)}
        {renderEditableField(
          "empresa_o_institucion",
          "Empresa/Institución",
          experience.empresa_o_institucion,
        )}
        {renderEditableField("ubicacion", "Ubicación", experience.ubicacion)}

        <div className="experience-dates">
          {renderEditableField(
            "fecha_inicio",
            "Fecha Inicio",
            experience.fecha_inicio,
            "date",
          )}
          {renderEditableField(
            "fecha_fin",
            "Fecha Fin",
            experience.fecha_fin,
            "date",
          )}
        </div>

        {renderEditableField(
          "descripcion",
          "Descripción",
          experience.descripcion,
          "textarea",
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
