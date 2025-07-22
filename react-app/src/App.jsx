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
  ProfileCompany,
  ProfileStudent,
  Dashboard,
  TechnicalTests,
  TechnicalTestQuiz,
  TechnicalTestResult,
  ComprarPuntos,
  Vacantes,
} from "./pages";
import { AuthProvider } from "./context/AuthContextProvider";
import "./assets/styles.css";
import "./assets/dashboard.css";
import "./assets/dashboard-styles.css";

// Componente wrapper para usar hooks dentro del router
const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = /^\/(login|register)(\/.*)?$/.test(
    location.pathname,
  );

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
        <Route path="/profile-company" element={<ProfileCompany />} />
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
