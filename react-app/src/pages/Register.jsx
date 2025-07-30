import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import ApiService from "../services/api";
import { useAuth } from "../hooks/useAuth";
// React Icons
import { FaCheck } from "react-icons/fa";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes("empresas")) return "empresas";
    if (location.pathname.includes("postulantes")) return "postulantes";
    return "postulantes";
  });
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    ruc: "",
    email: "",
    password: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/register/${tab}`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (activeTab === "postulantes") {
        if (!formData.fullName || !formData.email || !formData.password) {
          setError("Todos los campos son obligatorios");
          setLoading(false);
          return;
        }
        response = await ApiService.registerStudent(formData);
      } else {
        if (
          !formData.companyName ||
          !formData.ruc ||
          !formData.email ||
          !formData.password ||
          !formData.terms
        ) {
          setError(
            "Todos los campos son obligatorios y debe aceptar los términos",
          );
          setLoading(false);
          return;
        }
        response = await ApiService.registerCompany({
          nombre_empresa: formData.companyName,
          ruc: formData.ruc,
          correo: formData.email,
          contrasena: formData.password
        });
      }

      if (response.estado === 1) {
        console.log("Register response:", response); // Debug log

        // Get user ID and empresa ID from register response
        const userId = response.id_usuario;
        const empresaId = response.id_empresa;

        const userData = {
          email: formData.email,
          userType: activeTab,
          name:
            activeTab === "postulantes"
              ? formData.fullName
              : formData.companyName,
          id: userId,
          id_empresa: activeTab === "empresas" ? empresaId : undefined,
          realName:
            activeTab === "postulantes"
              ? formData.fullName
              : formData.companyName,
          ...response, // Include all registration response data
        };

        console.log("Final user data after registration:", userData); // Debug log
        login(userData);
        navigate("/");
      } else {
        setError(response.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate(`/login/${activeTab}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-brand">
          <Link to="/">
            <img src={logoImage} alt="TechBridge" className="auth-logo" />
          </Link>
        </div>
        <div className="auth-stats">
          <div className="stats-chart">
            <div className="chart-bar"></div>
            <div className="chart-bar active"></div>
            <div className="chart-bar"></div>
            <div className="chart-bar active"></div>
          </div>
          <div className="stats-text">
            <h3>100K+</h3>
            <p>Personas contratadas</p>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form">
          <div className="user-type-tabs">
            <button
              className={`tab-button ${activeTab === "postulantes" ? "active" : ""
                }`}
              onClick={() => handleTabChange("postulantes")}
            >
              Postulantes
            </button>
            <button
              className={`tab-button ${activeTab === "empresas" ? "active" : ""
                }`}
              onClick={() => handleTabChange("empresas")}
            >
              Empresas
            </button>
          </div>

          <h1 className="auth-title">
            {activeTab === "postulantes"
              ? "Obten más oportunidades"
              : "Impulsa tu empresa"}
          </h1>

          {error && (
            <div
              className="error-message"
              style={{
                color: "#ef4444",
                backgroundColor: "#fef2f2",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            {activeTab === "postulantes" ? (
              <div className="form-group">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Nombre de la Empresa</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ej. Google, Apple, Microsoft"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ruc">RUC</label>
                  <input
                    type="text"
                    id="ruc"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    placeholder="Ingresa el RUC de la empresa"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingresa tu correo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                />
                <span className="checkmark">
                  {formData.terms && <FaCheck size={12} color="white" />}
                </span>
                Al crear una cuenta estás de acuerdo con nuestros{" "}
                <Link to="/terminos" className="link">
                  términos de uso
                </Link>{" "}
                y con nuestra{" "}
                <Link to="/privacidad" className="link">
                  declaración de privacidad
                </Link>
                .
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-switch">
            <span>¿Ya tienes una cuenta?</span>
            <button
              type="button"
              onClick={handleLoginClick}
              className="link-button"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
