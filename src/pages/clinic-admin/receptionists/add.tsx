import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ClinicAdminAPI, AddReceptionistDto } from "../../../services/clinicAdmin.service";

export default function AddReceptionistPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clinicId, setClinicId] = useState("");
  
  const [formData, setFormData] = useState<AddReceptionistDto>({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      await ClinicAdminAPI.addReceptionist(clinicId, formData);
      setSuccess("Receptionist added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add receptionist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            Add New Receptionist
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new receptionist account for your clinic
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
                placeholder="Enter receptionist's full name"
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
                placeholder="receptionist@example.com"
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
                    Adding Receptionist...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Add Receptionist
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
  );
}
