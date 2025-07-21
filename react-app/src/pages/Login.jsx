import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import ApiService from "../services/api";
import { useAuth } from "../hooks/useAuth";
// React Icons
import { FaGoogle, FaCheck } from "react-icons/fa";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes("empresas")) return "empresas";
    if (location.pathname.includes("postulantes")) return "postulantes";
    return "postulantes";
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/login/${tab}`);
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
      if (!formData.email || !formData.password) {
        setError("Email y contraseña son obligatorios");
        setLoading(false);
        return;
      }

      let response;
      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      if (activeTab === "postulantes") {
        response = await ApiService.loginStudent(credentials);
      } else {
        response = await ApiService.loginCompany(credentials);
      }

      if (response.estado === 1) {
        console.log("Login response:", response); // Debug log

        // Extract user ID from login response
        // The login response should contain the id_usuario we need
        const userId =
          response.id_usuario ||
          response.usuario?.id_usuario ||
          response.id ||
          response.usuario?.id;
        console.log("User ID from login:", userId); // Debug log

        // Store basic user data without fetching additional details yet
        // Details will be fetched in the profile components when needed
        const userData = {
          email: formData.email,
          userType: activeTab,
          name: activeTab === "postulantes" ? "Estudiante" : "Empresa",
          id: userId,
          ...response, // Include all login r
          // onse data for reference
        };

        console.log("Final user data:", userData); // Debug log
        login(userData);
        navigate("/");
      } else {
        setError(response.mensaje || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate(`/register/${activeTab}`);
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
              className={`tab-button ${
                activeTab === "postulantes" ? "active" : ""
              }`}
              onClick={() => handleTabChange("postulantes")}
            >
              Postulantes
            </button>
            <button
              className={`tab-button ${
                activeTab === "empresas" ? "active" : ""
              }`}
              onClick={() => handleTabChange("empresas")}
            >
              Empresas
            </button>
          </div>

          <h1 className="auth-title">
            {activeTab === "postulantes"
              ? "Bienvenido, Jake"
              : "Impulsa tu empresa"}
          </h1>

          {activeTab === "postulantes" && (
            <button className="google-button">
              <FaGoogle size={20} />
              Iniciar sesión con Google
            </button>
          )}

          {activeTab === "postulantes" && (
            <div className="divider-section">
              <div className="divider-line"></div>
              <span>O iniciar sesión con email</span>
              <div className="divider-line"></div>
            </div>
          )}

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
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingresa tu email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
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
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                <span className="checkmark">
                  {formData.remember && <FaCheck size={12} color="white" />}
                </span>
                Recordarme en este dispositivo
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-switch">
            <span>¿No tienes una cuenta?</span>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="link-button"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
