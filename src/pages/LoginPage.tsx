import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { loginUser } from "../utils/auth";
import { Stethoscope, UserCheck, Users, Building2, ShieldCheck } from "lucide-react";
import "../styles/login.css";
import { useToast } from "../components/ui/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeRole, setActiveRole] = useState<string>("DOCTOR");
  const toast = useToast();

  // -------------------------------
  // ROLES ARRAY (Required)
  // -------------------------------
 const roles: {
  id: string;
  label: string;
  icon: any;
  color: string;
}[] = [
  {
    id: "DOCTOR",
    label: "Doctor",
    icon: Stethoscope,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "PATIENT",
    label: "Patient",
    icon: Users,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "RECEPTIONIST",
    label: "Receptionist",
    icon: UserCheck,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "CLINIC_ADMIN",
    label: "Clinic Admin",
    icon: Building2,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "SYSTEM_ADMIN",
    label: "Super Admin",
    icon: ShieldCheck,
    color: "from-red-500 to-rose-500",
  },
];


  // -------------------------------
  // LOGIN HANDLER
  // -------------------------------
  const handleLogin = async (): Promise<void> => {
    try {
      const user = await loginUser(email.trim(), password);

      if (!user) {
        toast.show("Invalid credentials", "error");
        return;
      }

      // NEW ROLE MISMATCH VALIDATION
      if (user.role !== activeRole) {
        toast.show(`Please select the correct role: ${user.role}`, "error");
        return;
      }

      toast.show(`Welcome, ${user.name}`, "success");

      // ROLE BASED REDIRECT ---------------------
      switch (user.role) {
        case "DOCTOR":
          window.location.href = "/doctor-dashboard";
          break;

        case "RECEPTIONIST":
          window.location.href = "/receptionist";
          break;

        case "PATIENT":
          window.location.href = "/patient-details";
          break;

        case "SYSTEM_ADMIN":
          window.location.href = "/super-admin";
          break;

        case "CLINIC_ADMIN":
          window.location.href = "/admin-dashboard";
          break;


        default:
          window.location.href = "/";
      }
    } catch (error) {
      toast.show("Login failed", "error");
    }
  };

  // -------------------------------------------
  // UI
  // -------------------------------------------
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">ClinicConnect AI</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-md">
            Streamlined healthcare management system for doctors, patients, and
            staff. Access your dashboard securely.
          </p>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">Access</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-blue-100">Secure</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">Fast</div>
              <div className="text-sm text-blue-100">Response</div>
            </div>
          </div>
          <p className="text-sm text-blue-200">
            © 2025 ClinicConnect AI. All rights reserved.
          </p>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              ClinicConnect AI
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Sign in to access your account
            </p>

            {/* Role Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl
">
              {roles.map(
                (
                  role: {
                    id: string;
                    label: string;
                    icon: any;
                    color: string;
                  },
                  index: number
                ) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveRole(role.id)}
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-lg transition-all duration-200 ${
                        activeRole === role.id
                          ? `bg-gradient-to-br ${role.color} text-white shadow-md`
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  );
                }
              )}
            </div>

            {/* EMAIL */}
            <Label className="text-gray-700 font-medium">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
              placeholder="email@example.com"
            />

            {/* PASSWORD */}
            <Label className="text-gray-700 font-medium">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6"
              placeholder="Enter your password"
            />

            {/* Login Button */}
            <Button
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg"
              onClick={handleLogin}
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  New to the portal?
                </span>
              </div>
            </div>

            {/* Sign Up */}
            <p className="text-center text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Contact{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@ClinicConnect AI
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
