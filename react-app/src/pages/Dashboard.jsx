import React from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardStudent from "../components/DashboardStudent";
import DashboardCompany from "../components/DashboardCompany";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  // Wait for auth to load
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        Cargando...
      </div>
    );
  }

  // Determine which dashboard to show based on user type
  const showStudentDashboard =
    user?.userType === "postulantes" || user?.userType === "estudiante";
  const showCompanyDashboard =
    user?.userType === "empresas" || user?.userType === "empresa";

  if (showStudentDashboard) {
    return <DashboardStudent />;
  }

  if (showCompanyDashboard) {
    return <DashboardCompany />;
  }

  // Fallback - show student dashboard by default
  return <DashboardStudent />;
};

export default Dashboard;
