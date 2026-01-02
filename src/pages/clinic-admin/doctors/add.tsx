import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  UserPlus, 
  Loader2,
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  UserCog,
  Settings,
  LogOut
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ClinicAdminAPI, AddDoctorDto } from "../../../services/clinicAdmin.service";

export default function AddDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clinicId, setClinicId] = useState("");
  
  const [formData, setFormData] = useState<AddDoctorDto>({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialityIds: [],
  });

  // Load clinic information
  useEffect(() => {
    ClinicAdminAPI.getMyClinic()
      .then((res) => {
        setClinicId(res.data.id);
      })
      .catch((err) => {
        setError("Failed to load clinic information");
        console.error(err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinicId) {
      setError("Clinic information not loaded");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await ClinicAdminAPI.addDoctor(clinicId, formData);
      setSuccess("Doctor added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialityIds: [],
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add doctor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            { id: "doctors", label: "Doctors", icon: Stethoscope, path: "/admin-dashboard", active: true },
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
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin-dashboard")}
                className="mb-4"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserPlus size={32} className="text-blue-600" />
                Add New Doctor
              </h1>
              <p className="text-gray-600 mt-2">
                Create a new doctor account for your clinic
              </p>
            </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter doctor's full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Password should be at least 8 characters long
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Adding Doctor...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Add Doctor
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin-dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
