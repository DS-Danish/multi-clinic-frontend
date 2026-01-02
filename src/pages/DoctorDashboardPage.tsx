import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { MessageCircle } from "lucide-react";
import DoctorLayout from "../components/DoctorLayout";

import {
  Building2,
  Calendar,
  Users,
  ClipboardList,
  FileText,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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

  return (
    <DoctorLayout userName={user.name}>
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

              <button 
                onClick={() => window.location.href = "/chatbot"}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>AI Medical Assistant</span>
              </button>
            </div>
          </div>
      </div>
    </DoctorLayout>
  );
}
