import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";



const ProfileCompany = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new empresa perfil page
    navigate("/empresa-perfil", { replace: true });
  }, [navigate]);

  return (
    <div className="profile-company-page">
      <div className="loading">Redirigiendo al perfil de empresa...</div>
    </div>
  );
};

export default ProfileCompany;
