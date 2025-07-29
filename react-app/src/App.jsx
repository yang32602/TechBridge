import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Header, Footer } from "./components";
import {
  Home,
  Login,
  Register,
  Postulantes,
  Contacto,
  ProfileStudent,
  Dashboard,
  TechnicalTests,
  TechnicalTestQuiz,
  TechnicalTestResult,
  ComprarPuntos,
  Vacantes,
  VacanteDetail,
  Terminos,
  Privacidad,
  Cookies,
  Postulaciones,
  VacantesAplicadas,
  EmpresaPerfil,
} from "./pages";
import { AuthProvider } from "./context/AuthContextProvider";
import "./assets/styles.css";
import "./assets/dashboard.css";
import "./assets/dashboard-styles.css";

// Componente wrapper para usar hooks dentro del router
const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = /^\/(login|register|dashboard|comprar-puntos|technical-test-quiz|technical-test-result|technical-tests|postulaciones|vacantes-aplicadas|profile-student|empresa-perfil|vacante)(\/.*)?$/.test(
    location.pathname,
  ) || location.pathname.startsWith('/empresa-perfil');

  return (
    <div className="app">
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:userType" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/:userType" element={<Register />} />
        <Route path="/postulantes" element={<Postulantes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/profile-company" element={<EmpresaPerfil />} />
        <Route path="/empresa-perfil" element={<EmpresaPerfil />} />
        <Route path="/empresa-perfil/:companyId" element={<EmpresaPerfil />} />
        <Route path="/profile-student" element={<ProfileStudent />} />
        <Route
          path="/profile-student/:studentId"
          element={<ProfileStudent />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/technical-tests" element={<TechnicalTests />} />
        <Route
          path="/technical-test-quiz/:testId"
          element={<TechnicalTestQuiz />}
        />
        <Route
          path="/technical-test-result/:testId"
          element={<TechnicalTestResult />}
        />
        <Route path="/comprar-puntos" element={<ComprarPuntos />} />
        <Route path="/vacantes" element={<Vacantes />} />
        <Route path="/vacante/:vacanteId" element={<VacanteDetail />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/postulaciones" element={<Postulaciones />} />
        <Route path="/vacantes-aplicadas" element={<VacantesAplicadas />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
