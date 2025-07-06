import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components";
import { Home, Login, Register } from "./pages";
import "./assets/styles.css";

function App() {
  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
