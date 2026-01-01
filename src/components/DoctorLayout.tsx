import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { logoutUser } from "../utils/auth";

interface DoctorLayoutProps {
  children: React.ReactNode;
  userName: string;
}

export default function DoctorLayout({ children, userName }: DoctorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: "Dashboard", icon: Stethoscope, href: "/doctor-dashboard" },
    { label: "Appointments", icon: Calendar, href: "/doctor-appointments" },
    { label: "Patients", icon: Users, href: "/doctor-patients" },
    { label: "Reports", icon: FileText, href: "/doctor-reports" },
    { label: "Settings", icon: Settings, href: "/doctor-settings", disabled: true },
  ];

  const handleNavigation = (href: string, disabled?: boolean) => {
    if (disabled) {
      return; // Do nothing for disabled items
    }
    navigate(href);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
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
                  <h1 className="text-xl font-bold text-gray-800">ClinicConnect AI</h1>
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
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500">Doctor</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0)}
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
            const isActive = location.pathname === item.href;
            return (
              <button
                key={idx}
                onClick={() => handleNavigation(item.href, item.disabled)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
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
        {children}
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
