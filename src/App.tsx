import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/dashboard";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import ReceptionistPage from "./pages/receptionist";
import { getCurrentUser, getToken } from "./utils/auth";
import DoctorPatientsPage from "./pages/doctor-patients"; 
import DoctorAppointmentsPage from "./pages/doctor-appointments";
import DoctorReportsPage from "./pages/doctor-reports";



// Inline Guard
const Guard = ({
  allow,
  children,
}: {
  allow: string[];
  children: React.ReactElement;
}) => {
  const token = getToken();
  const user = getCurrentUser();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  return (
    <Router>
  <Routes>
    {/* Public */}
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* Doctor */}
    <Route
      path="/doctor-dashboard"
      element={
        <Guard allow={["DOCTOR"]}>
          <DoctorDashboardPage />
        </Guard>
      }
    />

    <Route
      path="/doctor-patients"
      element={
        <Guard allow={["DOCTOR"]}>
          <DoctorPatientsPage />
        </Guard>
      }
    />

    {/* Patient */}
    <Route
      path="/patient-details"
      element={
        <Guard allow={["PATIENT"]}>
          <PatientDetailPage />
        </Guard>
      }
    />

    {/* Receptionist */}
    <Route
      path="/receptionist"
      element={
        <Guard allow={["RECEPTIONIST"]}>
          <ReceptionistPage />
        </Guard>
      }
    />

    {/* Doctor-Appointments */}
    <Route
      path="/doctor-appointments"
      element={
        <Guard allow={["DOCTOR"]}>
          <DoctorAppointmentsPage />
        </Guard>
      }
    />

    {/* Doctors-Report */}
    <Route
      path="/doctor-reports"
      element={
        <Guard allow={["DOCTOR"]}>
          <DoctorReportsPage />
        </Guard>
      }
    />

    {/* Admin */}
    <Route
      path="/dashboard"
      element={
        <Guard allow={["SYSTEM_ADMIN", "CLINIC_ADMIN"]}>
          <Dashboard />
        </Guard>
      }
    />
  </Routes>
</Router> ); 
}