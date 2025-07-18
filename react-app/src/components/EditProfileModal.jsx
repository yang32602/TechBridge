import React, { useState, useEffect } from "react";
import ApiService from "../services/api";
import { HiX, HiCheck, HiRefresh } from "react-icons/hi";
import "../assets/edit-profile-modal.css";

// TODO: Para agregar nuevos campos editables en el futuro:
// 1. Agregar el nuevo campo al array 'editableFields' con su configuración
// 2. El array debe incluir: key (nombre del campo), label (etiqueta), type (tipo de input), required (obligatorio)
// 3. El componente automáticamente renderizará el nuevo campo en el formulario
// 4. Asegurar que el backend maneje el nuevo campo en la ruta PATCH /estudiantes/actualizar

const EditProfileModal = ({
  isOpen,
  onClose,
  userDetails,
  userId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Configuración de campos editables
  // TODO: Agregar nuevos campos aquí cuando sea necesario
  const editableFields = [
    {
      key: "nombre_completo",
      label: "Nombre Completo",
      type: "text",
      required: true,
    },
    {
      key: "fecha_nacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
      required: false,
    },
    { key: "cedula", label: "Cédula", type: "text", required: false },
    { key: "telefono", label: "Teléfono", type: "tel", required: false },
    { key: "pais", label: "País", type: "text", required: false },
    { key: "provincia", label: "Provincia", type: "text", required: false },
    { key: "sobremi", label: "Sobre mí", type: "textarea", required: false },
    { key: "github", label: "GitHub", type: "url", required: false },
    { key: "X", label: "X (Twitter)", type: "url", required: false },
    { key: "Reddit", label: "Reddit", type: "url", required: false },
    {
      key: "lenguajes",
      label: "Lenguajes de Programación",
      type: "text",
      required: false,
    },
    // TODO: Agregar campos adicionales aquí:
    // { key: "linkedin", label: "LinkedIn", type: "url", required: false },
    // { key: "portafolio_url", label: "Portfolio URL", type: "url", required: false },
    // { key: "direccion", label: "Dirección", type: "text", required: false },
    // { key: "universidad", label: "Universidad", type: "text", required: false },
    // { key: "carrera", label: "Carrera", type: "text", required: false },
  ];

  useEffect(() => {
    if (isOpen && userDetails) {
      // Inicializar el formulario con los datos actuales
      const initialData = {};
      editableFields.forEach((field) => {
        initialData[field.key] = userDetails[field.key] || "";
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, userDetails]);

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[fieldKey]) {
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    editableFields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.key] || formData[field.key].trim() === "")
      ) {
        newErrors[field.key] = `${field.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const updatedFields = [];

    try {
      // Identificar campos que han cambiado
      const changedFields = [];
      editableFields.forEach((field) => {
        const currentValue = formData[field.key] || "";
        const originalValue = userDetails[field.key] || "";

        if (currentValue !== originalValue) {
          changedFields.push({
            campo: field.key,
            valor: currentValue,
            label: field.label,
          });
        }
      });

      if (changedFields.length === 0) {
        onClose();
        return;
      }

      // Actualizar cada campo modificado
      for (const field of changedFields) {
        try {
          await ApiService.updateStudentField(userId, field.campo, field.valor);
          updatedFields.push(field.label);
        } catch (error) {
          console.error(`Error actualizando ${field.label}:`, error);
          throw new Error(`Error actualizando ${field.label}`);
        }
      }

      // Notificar éxito y cerrar modal
      onSuccess && onSuccess(updatedFields);
      onClose();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setErrors({ general: error.message || "Error al guardar los cambios" });
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field) => {
    const value = formData[field.key] || "";
    const hasError = errors[field.key];

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="edit-form-field">
          <label className="edit-form-label">
            {field.label}
            {field.required && <span className="required-asterisk">*</span>}
          </label>
          <textarea
            className={`edit-form-textarea ${hasError ? "error" : ""}`}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={3}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }

    return (
      <div key={field.key} className="edit-form-field">
        <label className="edit-form-label">
          {field.label}
          {field.required && <span className="required-asterisk">*</span>}
        </label>
        <input
          type={field.type}
          className={`edit-form-input ${hasError ? "error" : ""}`}
          value={value}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          placeholder={`Ingrese ${field.label.toLowerCase()}`}
        />
        {hasError && <span className="error-message">{hasError}</span>}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Editar Perfil</h2>
          <button className="edit-modal-close-btn" onClick={onClose}>
            <HiX />
          </button>
        </div>

        <div className="edit-modal-body">
          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
            <div className="edit-form-grid">
              {editableFields.map(renderFormField)}
            </div>
          </form>
        </div>

        <div className="edit-modal-footer">
          <button
            type="button"
            className="edit-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="edit-btn-save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <HiRefresh className="spinner" />
                Guardando...
              </>
            ) : (
              <>
                <HiCheck />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
