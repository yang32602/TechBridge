import React, { useState } from "react";
import { HiPencil, HiSave, HiX, HiTrash } from "react-icons/hi";
import ApiService from "../services/api";

const EducationItem = ({ education, isReadOnly, onUpdate, onDelete }) => {
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
        ? formatDate(education[field])
        : education[field] || "",
    }));
  };

  const handleCancel = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setEditValues((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      await ApiService.updateStudentEducation(
        education.id,
        field,
        editValues[field],
      );

      // Update the local education data
      const updatedEducation = {
        ...education,
        [field]: editValues[field],
      };

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      onUpdate && onUpdate(updatedEducation);
    } catch (error) {
      console.error("Error updating education field:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta educación?")) {
      return;
    }

    setDeleting(true);
    try {
      await ApiService.deleteStudentEducation(education.id);
      onDelete && onDelete(education.id);
    } catch (error) {
      console.error("Error deleting education:", error);
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
        <div className="education-field-edit">
          <label className="education-field-label">{label}</label>
          <div className="education-edit-controls">
            {type === "textarea" ? (
              <textarea
                value={editValues[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="education-edit-input education-edit-textarea"
                rows={3}
                disabled={loading}
              />
            ) : (
              <input
                type={type}
                value={editValues[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="education-edit-input"
                disabled={loading}
              />
            )}
            <div className="education-edit-buttons">
              <button
                onClick={() => handleSave(field)}
                className="education-save-btn"
                disabled={loading}
              >
                <HiSave />
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="education-cancel-btn"
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
      <div className="education-field">
        <label className="education-field-label">{label}</label>
        <div className="education-field-content">
          <span className="education-field-value">
            {field.includes("fecha")
              ? formatDisplayDate(value)
              : value || "No especificado"}
          </span>
          {!isReadOnly && (
            <button
              onClick={() => handleEdit(field)}
              className="education-edit-icon"
            >
              <HiPencil />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="student-education-item">
      <div className="student-education-content">
        {!isReadOnly && (
          <div className="education-edit-header">
            <button
              onClick={handleDelete}
              className="education-delete-btn"
              disabled={deleting}
            >
              <HiTrash className="education-delete-icon" />
            </button>
          </div>
        )}

        {renderEditableField("nombre", "Institución", education.nombre)}
        {renderEditableField("pais", "País", education.pais)}

        <div className="education-dates">
          {renderEditableField(
            "fecha_inicio",
            "Fecha Inicio",
            education.fecha_inicio,
            "date",
          )}
          {renderEditableField(
            "fecha_fin",
            "Fecha Fin",
            education.fecha_fin,
            "date",
          )}
        </div>

        {renderEditableField(
          "descripcion",
          "Descripción",
          education.descripcion,
          "textarea",
        )}
      </div>
    </div>
  );
};

export default EducationItem;
