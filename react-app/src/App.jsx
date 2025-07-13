import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer } from "./components";
import { Home, Login, Register, Postulantes, Contacto } from "./pages";
import "./assets/styles.css";

// Componente wrapper para usar hooks dentro del router
const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = /^\/(login|register)(\/.*)?$/.test(location.pathname);

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
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
