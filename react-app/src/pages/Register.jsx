import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register submitted:", { ...formData, userType: activeTab });
    // Handle registration logic here
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
              ? "Obten más oportunidades"
              : "Impulsa tu empresa"}
          </h1>

          {activeTab === "postulantes" && (
            <button className="google-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.1706 8.36824H17.4993V8.33366H9.99935V11.667H14.7089C14.0219 13.6074 12.1756 15.0003 9.99935 15.0003C7.2381 15.0003 4.99935 12.7616 4.99935 10.0003C4.99935 7.23908 7.2381 5.00033 9.99935 5.00033C11.2739 5.00033 12.4335 5.48116 13.3164 6.26658L15.6735 3.90949C14.1852 2.52241 12.1943 1.66699 9.99935 1.66699C5.39727 1.66699 1.66602 5.39824 1.66602 10.0003C1.66602 14.6024 5.39727 18.3337 9.99935 18.3337C14.6014 18.3337 18.3327 14.6024 18.3327 10.0003C18.3327 9.44158 18.2752 8.89616 18.1706 8.36824Z"
                  fill="#FFC107"
                />
                <path
                  d="M2.62695 6.12158L5.36487 8.12949C6.1057 6.29533 7.89987 5.00033 9.99945 5.00033C11.274 5.00033 12.4336 5.48116 13.3165 6.26658L15.6736 3.90949C14.1853 2.52241 12.1945 1.66699 9.99945 1.66699C6.79862 1.66699 4.02279 3.47408 2.62695 6.12158Z"
                  fill="#FF3D00"
                />
                <path
                  d="M10.0008 18.3336C12.1533 18.3336 14.1091 17.5099 15.5879 16.1703L13.0087 13.9878C12.1439 14.6454 11.0872 15.0011 10.0008 15.0003C7.83328 15.0003 5.99286 13.6182 5.29953 11.6895L2.58203 13.7832C3.9612 16.482 6.76203 18.3336 10.0008 18.3336Z"
                  fill="#4CAF50"
                />
                <path
                  d="M18.1713 8.36759H17.5V8.33301H10V11.6663H14.7096C14.3809 12.5898 13.7889 13.3968 13.0067 13.9876L13.0079 13.9868L15.5871 16.1693C15.4046 16.3351 18.3333 14.1663 18.3333 9.99967C18.3333 9.44092 18.2758 8.89551 18.1713 8.36759Z"
                  fill="#1976D2"
                />
              </svg>
              Registrarse con Google
            </button>
          )}

          {activeTab === "postulantes" && (
            <div className="divider-section">
              <div className="divider-line"></div>
              <span>O registrarse con email</span>
              <div className="divider-line"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            {activeTab === "postulantes" && (
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>
            )}

            {activeTab === "empresas" && (
              <>
                <div className="form-group">
                  <label>Nombre de la empresa</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ingrese nombre de la empresa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>RUC o NIT</label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    placeholder="Ingrese su identificación empresarial"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>
                {activeTab === "postulantes"
                  ? "Correo electrónico"
                  : "Correo Institucional"}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={
                  activeTab === "postulantes"
                    ? "Ingresa tu correo electrónico"
                    : "Ingrese correo institucional"
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {activeTab === "empresas" && (
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="checkmark">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33398 8.00033L6.66732 11.3337L13.334 4.66699"
                        stroke="#E9EBFD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Acepto los{" "}
                  <a href="#" className="link">
                    Términos de Servicio
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="link">
                    Política de Privacidad
                  </a>{" "}
                  en nombre de mi empresa
                </label>
              </div>
            )}

            <button type="submit" className="submit-button">
              Registrar
            </button>
          </form>

          <div className="auth-switch">
            <span>¿Ya tienes una cuenta?</span>
            <button
              type="button"
              className="link-button"
              onClick={handleLoginClick}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
