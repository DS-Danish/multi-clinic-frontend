import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { registerUser } from "../utils/auth";
import type { UserRole } from "../utils/auth";
import { Stethoscope, UserCheck, Users, CheckCircle } from "lucide-react";
import "../styles/signup.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT" as UserRole, // default
  });

  // -----------------------------
  // Signup API Handler
  // -----------------------------
  const handleSignup = async (): Promise<void> => {
    const res = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    if (!res) {
      alert("Signup failed. Email may already exist.");
      return;
    }

    alert("Signup successful!");

    if (form.role === "DOCTOR") {
      window.location.href = "/dashboard";
    } else if (form.role === "RECEPTIONIST") {
      window.location.href = "/receptionist";
    } else {
      window.location.href = "/patient-details";
    }
  };

  // -----------------------------
  // Role Options
  // -----------------------------
  const roles = [
    {
      id: "PATIENT" as UserRole,
      label: "Patient",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      description: "Book appointments and manage health records",
    },
    {
      id: "DOCTOR" as UserRole,
      label: "Doctor",
      icon: Stethoscope,
      color: "from-blue-500 to-cyan-500",
      description: "Manage patients and appointments",
    },
    {
      id: "RECEPTIONIST" as UserRole,
      label: "Receptionist",
      icon: UserCheck,
      color: "from-purple-500 to-pink-500",
      description: "Handle scheduling and administration",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">HealthCare Portal</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Join Our Healthcare Community
          </h2>

          <p className="text-blue-100 text-lg max-w-md mb-12">
            Create your account and experience seamless healthcare management
            with our modern platform.
          </p>

          <div className="space-y-4">
            {[
              "Secure and encrypted data protection",
              "Real-time appointment scheduling",
              "Easy access to medical records",
              "24/7 platform availability",
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-blue-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-blue-200">
            © 2024 HealthCare Portal. All rights reserved.
          </p>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT SIDE — FORM */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HealthCare Portal</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
            <p className="text-gray-500 mb-8">Sign up to get started</p>

            {/* NAME */}
            <div className="mb-4">
              <Label className="text-gray-700 font-medium">Full Name</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="mt-1.5 h-11"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <Label className="text-gray-700 font-medium">Email Address</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5 h-11"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <Label className="text-gray-700 font-medium">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a strong password"
                className="mt-1.5 h-11"
              />
            </div>

            {/* ROLE SELECT */}
            <div className="mb-4">
              <Label className="text-gray-700 font-medium mb-3 block">I am a...</Label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = form.role === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.id })}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${role.color} text-white shadow-lg`
                          : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-white/20" : "bg-gray-100"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base">{role.label}</div>
                        <div
                          className={`text-sm ${
                            isSelected ? "text-white/90" : "text-gray-500"
                          }`}
                        >
                          {role.description}
                        </div>
                      </div>

                      {isSelected && <CheckCircle className="w-6 h-6" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <Button
              className="w-full h-11 mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg"
              onClick={handleSignup}
            >
              Create Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Already registered?
                </span>
              </div>
            </div>

            <p className="text-center text-gray-600">
              Have an account?{" "}
              <a href="/login" className="text-blue-600 font-semibold">
                Sign In
              </a>
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Contact{" "}
            <a href="#" className="text-blue-600 font-medium">
              support@healthcare.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
