import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  UserCog, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronRight,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  UserPlus,
  CalendarPlus
} from "lucide-react";

export default function ClinicAdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const stats = {
    totalDoctors: 8,
    totalPatients: 342,
    todayAppointments: 24,
    pendingAppointments: 7,
    revenue: 15420,
    receptionists: 3
  };

  const recentAppointments = [
    { id: 1, patient: "Sarah Johnson", doctor: "Dr. Smith", time: "09:00 AM", status: "confirmed" },
    { id: 2, patient: "Mike Peters", doctor: "Dr. Williams", time: "10:30 AM", status: "pending" },
    { id: 3, patient: "Emma Davis", doctor: "Dr. Brown", time: "11:00 AM", status: "confirmed" },
    { id: 4, patient: "John Wilson", doctor: "Dr. Smith", time: "02:00 PM", status: "cancelled" },
  ];

  const quickActions = [
    { icon: UserPlus, label: "Add Doctor", color: "bg-blue-500", action: () => {} },
    { icon: Users, label: "Add Patient", color: "bg-green-500", action: () => {} },
    { icon: CalendarPlus, label: "New Appointment", color: "bg-purple-500", action: () => {} },
    { icon: UserCog, label: "Add Receptionist", color: "bg-orange-500", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">City Medical Center</h1>
              <p className="text-sm text-gray-500">Clinic Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "doctors", label: "Doctors", icon: Stethoscope, badge: stats.totalDoctors },
            { id: "patients", label: "Patients", icon: Users, badge: stats.totalPatients },
            { id: "appointments", label: "Appointments", icon: Calendar, badge: stats.pendingAppointments },
            { id: "receptionists", label: "Receptionists", icon: UserCog },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ⭐ UPDATED LOGOUT BUTTON ⭐ */}
        <div className="absolute bottom-0 w-72 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-5 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeSection === "dashboard" && "Dashboard Overview"}
                {activeSection === "doctors" && "Manage Doctors"}
                {activeSection === "patients" && "Patient Management"}
                {activeSection === "appointments" && "Appointments"}
                {activeSection === "receptionists" && "Receptionist Management"}
                {activeSection === "settings" && "Clinic Settings"}
              </h2>
              <p className="text-gray-500 mt-1">
                {activeSection === "dashboard" && "Monitor your clinic's performance and activities"}
                {activeSection === "doctors" && "Add, edit, and manage doctor profiles"}
                {activeSection === "patients" && "View and manage patient records"}
                {activeSection === "appointments" && "Schedule and track appointments"}
                {activeSection === "receptionists" && "Manage reception staff"}
                {activeSection === "settings" && "Configure clinic preferences"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="p-8">

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Doctors</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.totalDoctors}</h3>
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> 2 new this month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <Stethoscope className="text-blue-600" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Patients</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.totalPatients}</h3>
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> 28 this week
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-xl">
                    <Users className="text-green-600" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Appointments</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.todayAppointments}</h3>
                    <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                      <Clock size={14} /> {stats.pendingAppointments} pending
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-xl">
                    <Calendar className="text-purple-600" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <h3 className="text-3xl font-bold mt-2">${stats.revenue.toLocaleString()}</h3>
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +12% this month
                    </p>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-xl">
                    <DollarSign className="text-emerald-600" size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md transition"
                  >
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <action.icon className="text-white" size={24} />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Appointments</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {appointment.patient.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">{appointment.doctor}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.time}</p>

                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-1 ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {appointment.status === "confirmed" && <CheckCircle size={12} />}
                          {appointment.status === "pending" && <Clock size={12} />}
                          {appointment.status === "cancelled" && <AlertCircle size={12} />}
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinic Activity */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Clinic Activity</h3>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { icon: UserPlus, color: "bg-green-100 text-green-600", title: "New doctor added", desc: "Dr. Emily Chen joined", time: "2 hours ago" },
                    { icon: Calendar, color: "bg-blue-100 text-blue-600", title: "Schedule updated", desc: "Dr. Smith next week", time: "5 hours ago" },
                    { icon: Activity, color: "bg-purple-100 text-purple-600", title: "System maintenance", desc: "Scheduled this weekend", time: "1 day ago" },
                    { icon: Users, color: "bg-orange-100 text-orange-600", title: "New patient registrations", desc: "15 new patients", time: "3 hours ago" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other sections */}
        {activeSection !== "dashboard" && (
          <div className="p-12 flex justify-center">
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center w-full max-w-2xl">
              <h3 className="text-2xl font-bold mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
              </h3>
              <p className="text-gray-500">
                This section is under development. Full functionality coming soon.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
