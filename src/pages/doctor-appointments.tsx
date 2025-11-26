import React, { useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser } from "../utils/auth";
import { Input } from "../components/ui/input";
import { Calendar, User } from "lucide-react";

type TAppointment = {
  id: string;
  patientName: string;
  clinicName: string;
  startTime: string;
  endTime: string;
};

const DoctorAppointmentsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<TAppointment[]>([]);
  const [filtered, setFiltered] = useState<TAppointment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const current = getCurrentUser();

    if (!current || current.role !== "DOCTOR") {
      window.location.href = "/login";
      return;
    }

    setUser(current);
    loadAppointments(current.id);
  }, []);

  const loadAppointments = async (doctorId: string): Promise<void> => {
    try {
      const res = await api.get(`/appointments/doctor/${doctorId}`);
      setAppointments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    const q = value.toLowerCase();
    setFiltered(
      appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.clinicName.toLowerCase().includes(q)
      )
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-64 pt-20">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
        <p className="text-gray-600 mb-6">
          All upcoming and completed appointments for today & this week.
        </p>

        <Input
          placeholder="Search by patient or clinic..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md mb-6"
        />

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Clinic</th>
                <th className="px-4 py-3 text-left">Start</th>
                <th className="px-4 py-3 text-left">End</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      {a.patientName}
                    </td>

                    <td className="px-4 py-3">{a.clinicName}</td>
                    <td className="px-4 py-3">
                      {new Date(a.startTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(a.endTime).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
