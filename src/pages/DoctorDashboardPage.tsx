import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { Button } from "../components/ui/button";

import {
  Stethoscope,
  Building2,
  Calendar,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  FileText,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (current && current.role === "DOCTOR") {
      setUser(current);
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!user) return null;

  const stats = [
    { label: "Today's Appointments", value: "12", icon: Calendar, color: "from-blue-500 to-cyan-500" },
    { label: "Total Patients", value: "248", icon: Users, color: "from-green-500 to-emerald-500" },
    { label: "Pending Reports", value: "5", icon: ClipboardList, color: "from-purple-500 to-pink-500" },
    { label: "Active Clinics", value: "2", icon: Building2, color: "from-orange-500 to-red-500" },
  ];

  const navigationItems = [
    { label: "Dashboard", icon: Stethoscope, href: "/doctor-dashboard" },
    { label: "Appointments", icon: Calendar, href: "/doctor-appointments" },
    { label: "Patients", icon: Users, href: "/doctor-patients" },
    { label: "Reports", icon: FileText, href: "/doctor-reports" },
    { label: "Settings", icon: Settings, href: "/doctor-settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-800">HealthCare Portal</h1>
                  <p className="text-xs text-gray-500">Doctor Dashboard</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">Doctor</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-2">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => (window.location.href = item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6 lg:p-8">
          {/* GREETING */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, Dr. {user.name.split(" ")[1] || user.name}! 👋
          </h2>
          <p className="text-gray-600 mb-8">Here's what's happening today.</p>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                <Calendar className="w-5 h-5" />
                <span>View Schedule</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition">
                <Users className="w-5 h-5" />
                <span>Add Patient</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition">
                <FileText className="w-5 h-5" />
                <span>Create Report</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
