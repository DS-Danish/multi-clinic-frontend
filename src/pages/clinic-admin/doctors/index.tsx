import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  UserCog,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ClinicAdminAPI } from "../../../services/clinicAdmin.service";

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinicId, setClinicId] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const clinicRes = await ClinicAdminAPI.getMyClinic();
        const currentClinicId = clinicRes.data.id;
        setClinicId(currentClinicId);

        const doctorsRes = await ClinicAdminAPI.getClinicDoctors(currentClinicId);
        setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
            { id: "doctors", label: "Doctors", icon: Stethoscope, path: "/admin-dashboard/doctors", active: true },
            { id: "patients", label: "Patients", icon: Users, path: "/admin-dashboard" },
            { id: "appointments", label: "Appointments", icon: Calendar, path: "/admin-dashboard" },
            { id: "receptionists", label: "Receptionists", icon: UserCog, path: "/admin-dashboard" },
            { id: "settings", label: "Settings", icon: Settings, path: "/admin-dashboard" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

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
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
                  <p className="text-gray-600 mt-2">
                    Manage your clinic's doctors
                  </p>
                </div>
                
                <Button onClick={() => navigate("/admin-dashboard/doctors/add")}>
                  <UserPlus className="mr-2" size={20} />
                  Add Doctor
                </Button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                {doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="text-blue-600" size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-500">{doctor.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {doctor.phone && (
                            <p className="text-sm text-gray-600">{doctor.phone}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-12">
                    No doctors found. Add your first doctor to get started.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
