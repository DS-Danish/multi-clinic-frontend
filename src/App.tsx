import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Dashboard from "./pages/dashboard";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import ReceptionistPage from "./pages/receptionist";
import DoctorPatientsPage from "./pages/doctor-patients"; 
import DoctorAppointmentsPage from "./pages/doctor-appointments";
import DoctorReportsPage from "./pages/doctor-reports";
import BillDetailPage from "./pages/BillDetailPage";
import CreateBillPage from "./pages/CreateBillPage";
import SuperAdminDashboard from "./pages/Super-admin";
import AdminDashboard from "./pages/ClinicAdminDashboard";
import ReceptionistsPage from "./pages/clinic-admin/receptionists/index";
import AddReceptionistPage from "./pages/clinic-admin/receptionists/add";
import { getCurrentUser, getToken } from "./utils/auth";
import ToastProvider from "./components/ui/ToastProvider";

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
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

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
        <Route
          path="/doctor-appointments"
          element={
            <Guard allow={["DOCTOR"]}>
              <DoctorAppointmentsPage />
            </Guard>
          }
        />
        <Route
          path="/doctor-reports"
          element={
            <Guard allow={["DOCTOR"]}>
              <DoctorReportsPage />
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
        <Route
          path="/billing/create"
          element={
            <Guard allow={["RECEPTIONIST"]}>
              <CreateBillPage />
            </Guard>
          }
        />
        <Route
          path="/billing/:billId"
          element={
            <Guard allow={["RECEPTIONIST"]}>
              <BillDetailPage />
            </Guard>
          }
        />

        {/* System Admin */}
        <Route
          path="/super-admin"
          element={
            <Guard allow={["SYSTEM_ADMIN"]}>
              <SuperAdminDashboard />
            </Guard>
          }
        />

        {/* Clinic Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <Guard allow={["CLINIC_ADMIN"]}>
              <AdminDashboard />
            </Guard>
          }
        />
        <Route
          path="/admin-dashboard/receptionists"
          element={
            <Guard allow={["CLINIC_ADMIN"]}>
              <ReceptionistsPage />
            </Guard>
          }
        />
        <Route
          path="/admin-dashboard/receptionists/add"
          element={
            <Guard allow={["CLINIC_ADMIN"]}>
              <AddReceptionistPage />
            </Guard>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}
