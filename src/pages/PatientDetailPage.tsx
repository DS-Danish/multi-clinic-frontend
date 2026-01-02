import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Phone,
  MapPin,
  Activity,
  Bell,
  Clock,
  MessageCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { useToast } from "../components/ui/ToastProvider";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditAppointmentDialog from "../components/ui/EditAppointmentDialog";
import { AppointmentStatus } from "../types/appointment.types";
import { ReportService, PatientReportResponse } from "../services/report.service";

export default function PatientDetailPage() {
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Appointment state
  const [clinics, setClinics] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Reports state
  const [reports, setReports] = useState<PatientReportResponse[]>([]);
  const [selectedReport, setSelectedReport] = useState<PatientReportResponse | null>(null);
  const [viewReportDialog, setViewReportDialog] = useState(false);
  
  // Cancel confirmation state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  
  // Edit appointment state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  
  // Show cancelled appointments toggle
  const [showCancelled, setShowCancelled] = useState(false);
  

  // ---------------------------------------
  // AUTH CHECK
  // ---------------------------------------
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      window.location.href = "/login";
    } else {
      setUser(current);
    }
  }, []);

  // ---------------------------------------
  // LOAD Clinics & Notifications
  // ---------------------------------------
  useEffect(() => {
    if (!user) return;

    loadClinics();
    loadAppointments();
    loadNotifications();
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadClinics = async () => {
    const res = await api.get("/clinics");
    setClinics(res.data);
  };

  const loadDoctors = async (clinicId: string) => {
    const res = await api.get(`/doctors/clinic/${clinicId}`);
    setDoctors(res.data);
  };

  const loadAppointments = async () => {
    const res = await api.get(`/appointments/patient/${user.id}`);
    setAppointments(res.data);
  };

  const loadNotifications = async () => {
    const res = await api.get(`/notifications/${user.id}`);
    setNotifications(res.data);
  };

  const loadReports = async () => {
    if (!user?.id) return;
    try {
      const data = await ReportService.getPatientReports(user.id);
      setReports(data);
    } catch (err) {
      console.error("Error loading reports", err);
    }
  };

  // ---------------------------------------
  // CREATE APPOINTMENT
  // ---------------------------------------
  const handleCreateAppointment = async () => {
    if (!selectedClinic || !selectedDoctor || !startTime || !endTime) {
      toast.show("Please fill all fields", "error");
      return;
    }

    try {
      await api.post("/appointments", {
        clinicId: selectedClinic,
        doctorId: selectedDoctor,
        startTime,
        endTime,
      });

      toast.show("Appointment request sent!", "success");

      loadAppointments(); // refresh UI
      setStartTime("");
      setEndTime("");
      setSelectedClinic("");
      setSelectedDoctor("");
      setDoctors([]);
    } catch (err: any) {
      toast.show(err.response?.data?.message || "Unable to create appointment", "error");
    }
  };

  // ---------------------------------------
  // CANCEL APPOINTMENT
  // ---------------------------------------
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      await api.patch(`/appointments/${appointmentToCancel}/cancel`);
      toast.show("Appointment cancelled successfully", "success");
      loadAppointments(); // refresh the list
    } catch (err: any) {
      toast.show(err.response?.data?.message || "Failed to cancel appointment", "error");
    } finally {
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const openCancelDialog = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };

  // ---------------------------------------
  // EDIT APPOINTMENT
  // ---------------------------------------
  const openEditDialog = (appointment: any) => {
    setAppointmentToEdit(appointment);
    setEditDialogOpen(true);
  };

  const handleEditAppointment = async (data: any) => {
    if (!data.id) return;

    try {
      await api.patch(`/appointments/${data.id}`, {
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
      });
      toast.show("Appointment updated successfully", "success");
      loadAppointments(); // refresh the list
    } catch (err: any) {
      toast.show(err.response?.data?.message || "Failed to update appointment", "error");
    } finally {
      setEditDialogOpen(false);
      setAppointmentToEdit(null);
    }
  };

  // ---------------------------------------
  // LOGOUT
  // ---------------------------------------
  const handleLogout = (): void => {
    logoutUser();
    window.location.href = "/login";
  };

  // Helper to render status badge
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      SCHEDULED: "bg-blue-100 text-blue-700 border border-blue-300",
      COMPLETED: "bg-green-100 text-green-700 border border-green-300",
      CANCELLED: "bg-red-100 text-red-700 border border-red-300",
    };

    return (
      <span className={`text-sm mt-1 inline-block px-3 py-1 rounded font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading patient data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
              <p className="text-sm text-gray-500">Manage your health</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "/chatbot"}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md flex items-center gap-2"
            >
              <MessageCircle size={20} />
              AI Medical Assistant
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">{user.name}</h2>

              <div className="flex items-center gap-4 text-blue-100">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>

                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-gray-200 flex px-8">
            {["overview", "appointments", "reports", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-all ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------- */}
        {/* TAB 1: OVERVIEW */}
        {/* ---------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Appointments</p>
                    <h3 className="text-3xl font-bold mt-1">{appointments.length}</h3>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-200 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Notifications</p>
                    <h3 className="text-3xl font-bold mt-1">{notifications.length}</h3>
                  </div>
                  <Bell className="w-12 h-12 text-purple-200 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Account Status</p>
                    <h3 className="text-xl font-bold mt-1">Active</h3>
                  </div>
                  <Activity className="w-12 h-12 text-green-200 opacity-80" />
                </div>
              </div>
            </div>

            {/* Patient Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CONTACT INFO */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email Address</p>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                      <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                    </div>
                  </div>

                  {user.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Address</p>
                        <p className="text-gray-900 font-medium">{user.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BASIC INFO */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Full Name</p>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Book Appointment</div>
                    <div className="text-sm text-gray-500">Schedule a visit</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Bell className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">View Notifications</div>
                    <div className="text-sm text-gray-500">Check updates</div>
                  </div>
                </button>

                <button
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Activity className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Medical Records</div>
                    <div className="text-sm text-gray-500">View history</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------- */}
        {/* TAB 2: APPOINTMENTS */}
        {/* ---------------------------- */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-6">Book Appointment</h3>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Clinic */}
              <div>
                <label className="font-medium">Select Clinic</label>
                <select
                  value={selectedClinic}
                  onChange={(e) => {
                    setSelectedClinic(e.target.value);
                    loadDoctors(e.target.value);
                  }}
                  className="w-full border p-3 rounded-lg mt-2"
                >
                  <option value="">-- Choose --</option>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="font-medium">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full border p-3 rounded-lg mt-2"
                >
                  <option value="">-- Choose --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border p-3 rounded-lg mt-2"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="font-medium">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border p-3 rounded-lg mt-2"
                />
              </div>
            </div>

            <button
              onClick={handleCreateAppointment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Appointment Request
            </button>

            {/* Appointment List */}
            <div className="flex items-center justify-between mt-10 mb-4">
              <h3 className="text-xl font-bold">Your Appointments</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCancelled}
                  onChange={(e) => setShowCancelled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">Show cancelled appointments</span>
              </label>
            </div>

            {(() => {
              const filteredAppointments = showCancelled 
                ? appointments 
                : appointments.filter(a => a.status !== 'CANCELLED');
              
              return filteredAppointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredAppointments.map((a) => (
                  <li
                    key={a.id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {a.clinicName} — Dr. {a.doctorName}
                        </div>
                        <div className="text-gray-600">
                          {new Date(a.startTime).toLocaleString()}
                        </div>
                        {getStatusBadge(a.status)}
                      </div>
                      {(a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.SCHEDULED) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditDialog(a)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openCancelDialog(a.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        )}

        {/* ---------------------------- */}
        {/* TAB 3: NOTIFICATIONS */}
        {/* ---------------------------- */}
        {/* REPORTS TAB */}
        {/* ---------------------------- */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Medical Reports
            </h3>

            {reports.length === 0 ? (
              <p className="text-gray-600">No medical reports available yet.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((reportData) => (
                  <div
                    key={reportData.report.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{reportData.report.title}</h4>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {reportData.doctor.name} • {reportData.clinic.name}
                          </p>
                          {reportData.report.diagnosis && (
                            <p className="text-sm text-gray-600 mt-1">
                              {reportData.report.diagnosis.substring(0, 100)}
                              {reportData.report.diagnosis.length > 100 ? "..." : ""}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(reportData.report.createdAt).toLocaleDateString()}
                            </span>
                            {reportData.report.updatedAt !== reportData.report.createdAt && (
                              <span>
                                Updated: {new Date(reportData.report.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReport(reportData);
                          setViewReportDialog(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------- */}
        {/* NOTIFICATIONS TAB */}
        {/* ---------------------------- */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Notifications
            </h3>

            {notifications.length === 0 ? (
              <p className="text-gray-600">No notifications</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{n.message}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(n.sentAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <EditAppointmentDialog
        open={editDialogOpen}
        appointment={appointmentToEdit}
        onClose={() => {
          setEditDialogOpen(false);
          setAppointmentToEdit(null);
        }}
        onSave={handleEditAppointment}
      />

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        onCancel={() => {
          setCancelDialogOpen(false);
          setAppointmentToCancel(null);
        }}
        onConfirm={handleCancelAppointment}
      />

      {/* View Report Dialog */}
      {viewReportDialog && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedReport.report.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedReport.doctor.name} • {selectedReport.clinic.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(selectedReport.report.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewReportDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Report Content
                </h3>
                <p className="text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {selectedReport.report.content}
                </p>
              </div>
              
              {selectedReport.report.diagnosis && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Diagnosis</h3>
                  <p className="text-red-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.report.diagnosis}
                  </p>
                </div>
              )}
              
              {selectedReport.report.prescription && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Prescription</h3>
                  <p className="text-green-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.report.prescription}
                  </p>
                </div>
              )}
              
              {selectedReport.report.recommendations && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Recommendations</h3>
                  <p className="text-yellow-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.report.recommendations}
                  </p>
                </div>
              )}
              
              {selectedReport.report.fileUrl && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Attachment</h3>
                  <a
                    href={selectedReport.report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {selectedReport.report.fileUrl}
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setViewReportDialog(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
