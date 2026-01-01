import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";
import { Input } from "../components/ui/input";
import { User as UserIcon } from "lucide-react";
import DoctorLayout from "../components/DoctorLayout";

type TPatient = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
};

const DoctorPatientsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<TPatient[]>([]);
  const [filtered, setFiltered] = useState<TPatient[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const current = getCurrentUser();

    if (!current || current.role !== "DOCTOR") {
      window.location.href = "/login";
      return; // ✅ useEffect must return void
    }

    setUser(current);
    fetchPatients();
  }, []);

  const fetchPatients = async (): Promise<void> => {
    try {
      const res = await api.get<TPatient[]>("/users/patients");
      setPatients(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleSearch = (value: string): void => {
    setSearch(value);
    const q = value.toLowerCase();

    setFiltered(
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone && p.phone.toLowerCase().includes(q))
      )
    );
  };

  if (!user) return null;

  return (
    <DoctorLayout userName={user.name}>
      <div className="p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Patients</h1>
        <p className="text-gray-600 mb-6">
          List of all registered patients in the system.
        </p>

        <div className="flex gap-3 mb-6">
          <Input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Registered</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{p.email}</td>
                    <td className="px-4 py-3 text-gray-700">{p.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorPatientsPage;
