import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Building2,
  Users,
  Plus,
  Search,
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useToast } from "../components/ui/ToastProvider";

type Clinic = {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  admins: number;
  patients: number;
};

type FormField =
  | "clinicName"
  | "clinicCode"
  | "clinicEmail"
  | "clinicPhone"
  | "adminName"
  | "adminEmail"
  | "adminPassword";

export default function SuperAdminDashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // ⭐ FETCHED FROM BACKEND — no more dummy data
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [formData, setFormData] = useState({
    clinicName: "",
    clinicCode: "",
    clinicEmail: "",
    clinicPhone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  // ===========================================================
  // ⭐ Load Clinics From Backend (REAL DATA)
  // ===========================================================
  const loadClinics = async () => {
    try {
      const res = await api.get("/super-admin/clinics");
      setClinics(res.data);
    } catch (err) {
      console.error("Failed to load clinics:", err);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  // Input handler
  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===========================================================
  // ⭐ Create Clinic + Admin
  // ===========================================================
  const handleCreate = async () => {
    try {
      await api.post("/super-admin/create-clinic-with-admin", {
        clinicName: formData.clinicName,
        clinicCode: formData.clinicCode,
        clinicEmail: formData.clinicEmail,
        clinicPhone: formData.clinicPhone,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      });

      toast.show("Clinic + Admin created successfully!", "success");

      // Refresh real clinic list
      await loadClinics();

      // Reset form
      setFormData({
        clinicName: "",
        clinicCode: "",
        clinicEmail: "",
        clinicPhone: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });

      setActiveTab("dashboard");
    } catch (err: any) {
      console.error(err);
      toast.show(err.response?.data?.message || "Failed to create clinic", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Super Admin</h1>
          <p className="text-sm text-gray-500">Control Panel</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("create")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "create" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Plus size={20} />
            <span className="font-medium">Add Clinic</span>
          </button>
          
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {/* ⭐ LOGOUT BUTTON */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        <div className="bg-white shadow-sm border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === "dashboard" ? "Dashboard Overview" : "Create New Clinic"}
              </h2>
              <p className="text-gray-500 mt-1">
                {activeTab === "dashboard" 
                  ? "Manage all clinics and administrators" 
                  : "Add a new clinic with admin account"}
              </p>
            </div>

            {activeTab === "dashboard" && (
              <button
                onClick={() => setActiveTab("create")}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Add New Clinic
              </button>
            )}
          </div>
        </div>

        {/* ============================
            DASHBOARD VIEW
        ============================ */}
        {activeTab === "dashboard" && (
          <div className="p-8">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <p className="text-gray-500 text-sm">Total Clinics</p>
                <h3 className="text-3xl font-bold mt-2">{clinics.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <p className="text-gray-500 text-sm">Total Admins</p>
                <h3 className="text-3xl font-bold mt-2">
                  {clinics.reduce((sum, c) => sum + c.admins, 0)}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <p className="text-gray-500 text-sm">Total Patients</p>
                <h3 className="text-3xl font-bold mt-2">
                  {clinics.reduce((sum, c) => sum + c.patients, 0)}
                </h3>
              </div>
            </div>

            {/* Clinics Table */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">All Clinics</h3>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search clinics..."
                      className="pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Clinic Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Admins</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Patients</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {clinics.map((clinic) => (
                    <tr key={clinic.id}>
                      <td className="px-6 py-4">{clinic.name}</td>
                      <td className="px-6 py-4">{clinic.code}</td>
                      <td className="px-6 py-4">
                        {clinic.email} <br />
                        <span className="text-gray-500">{clinic.phone}</span>
                      </td>
                      <td className="px-6 py-4">{clinic.admins}</td>
                      <td className="px-6 py-4">{clinic.patients}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {/* ============================
            CREATE CLINIC VIEW
        ============================ */}
        {activeTab === "create" && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h3 className="text-xl font-semibold mb-6">Clinic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => handleInputChange("clinicName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.clinicCode}
                      onChange={(e) => handleInputChange("clinicCode", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="e.g., CLN001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.clinicEmail}
                      onChange={(e) => handleInputChange("clinicEmail", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="clinic@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.clinicPhone}
                      onChange={(e) => handleInputChange("clinicPhone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold mb-6">Admin Account Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.adminName}
                        onChange={(e) => handleInputChange("adminName", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter admin name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.adminPassword}
                        onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter admin password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Create Clinic & Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
