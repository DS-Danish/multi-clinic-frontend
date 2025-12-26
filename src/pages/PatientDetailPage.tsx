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
} from "lucide-react";

import api from "../services/api";
import { getCurrentUser, logoutUser } from "../utils/auth";

export default function PatientDetailPage() {
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
  }, [user]);

  const loadClinics = async () => {
    const res = await api.get("/receptionist/clinics");
    setClinics(res.data);
  };

  const loadDoctors = async (clinicId: string) => {
    const res = await api.get(`/receptionist/clinics/${clinicId}/doctors`);
    setDoctors(res.data.map((d: any) => d.doctor));
  };

  const loadAppointments = async () => {
    const res = await api.get(`/appointments/patient/${user.id}`);
    setAppointments(res.data);
  };

  const loadNotifications = async () => {
    const res = await api.get(`/notifications/${user.id}`);
    setNotifications(res.data);
  };

  // ---------------------------------------
  // CREATE APPOINTMENT
  // ---------------------------------------
  const handleCreateAppointment = async () => {
    if (!selectedClinic || !selectedDoctor || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/receptionist/appointments", {
        clinicId: selectedClinic,
        doctorId: selectedDoctor,
        patientId: user.id,
        startTime,
        endTime,
      });

      alert("Appointment request sent!");

      loadAppointments(); // refresh UI
      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Unable to create appointment");
    }
  };

  // ---------------------------------------
  // LOGOUT
  // ---------------------------------------
  const handleLogout = (): void => {
    logoutUser();
    window.location.href = "/login";
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

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md"
          >
            Logout
          </button>
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
            {["overview", "appointments", "notifications"].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CONTACT INFO */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>

              <p className="text-gray-700 font-medium">{user.email}</p>
              {user.phone && <p className="text-gray-700">{user.phone}</p>}
            </div>

            {/* BASIC INFO */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Info
              </h3>

              <p className="text-gray-700">Role: {user.role}</p>
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
            <h3 className="text-xl font-bold mt-10 mb-4">Your Appointments</h3>

            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments found.</p>
            ) : (
              <ul className="space-y-4">
                {appointments.map((a) => (
                  <li
                    key={a.id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">
                      {a.clinicName} — Dr. {a.doctorName}
                    </div>
                    <div className="text-gray-600">
                      {new Date(a.startTime).toLocaleString()}
                    </div>
                    <span className="text-sm mt-1 inline-block px-3 py-1 rounded bg-blue-100 text-blue-700">
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ---------------------------- */}
        {/* TAB 3: NOTIFICATIONS */}
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
    </div>
  );
}
