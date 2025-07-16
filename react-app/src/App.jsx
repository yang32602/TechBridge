import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components";
import {
  Home,
  Login,
  Register,
  ProfileCompany,
  ProfileStudent,
  Dashboard,
  TechnicalTests,
  TechnicalTestQuiz,
  TechnicalTestResult,
  ComprarPuntos,
} from "./pages";
import { AuthProvider } from "./context/AuthContextProvider";
import "./assets/styles.css";
import "./assets/dashboard.css";
import "./assets/dashboard-styles.css";

/*hola*/

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:userType" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/:userType" element={<Register />} />
            <Route path="/profile-company" element={<ProfileCompany />} />
            <Route path="/profile-student" element={<ProfileStudent />} />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
