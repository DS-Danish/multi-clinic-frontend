import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";
import { FileText } from "lucide-react";

type TReport = {
  id: string;
  type: string;
  createdAt: string;
  clinicName: string;
  data: any;
};

const DoctorReportsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<TReport[]>([]);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== "DOCTOR") {
      window.location.href = "/login";
      return;
    }

    setUser(current);
    fetchReports(current.id);
  }, []);

  const fetchReports = async (doctorId: string) => {
    try {
      const res = await api.get<TReport[]>(`/reports/doctor/${doctorId}`);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:pl-64 pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Reports</h1>
        <p className="text-gray-600 mb-6">
          Review all reports generated for your appointments.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Clinic</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Summary</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-800">{r.type}</span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{r.clinicName}</td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {r.data
                        ? JSON.stringify(r.data).substring(0, 40) + "..."
                        : "—"}
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

export default DoctorReportsPage;
