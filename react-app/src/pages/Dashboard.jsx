import React from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardStudent from "../components/DashboardStudent";
import DashboardCompany from "../components/DashboardCompany";

const Dashboard = () => {
  const { user } = useAuth();

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
