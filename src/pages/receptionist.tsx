import React, { useEffect, useState } from "react";
import { ReceptionistAPI } from "../services/receptionist.service";
import { logoutUser } from "../utils/auth";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditAppointmentModal from "../components/ui/EditAppointmentDialog";
import { useToast } from "../components/ui/ToastProvider";
import { useNavigate } from "react-router-dom";

type TPatient = {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
};

type TAppointment = {
  id: string;
  patientName: string;
  doctorId?: string;
  startTime: string;
};

export default function ReceptionistPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const showError = (msg: string) => toast.show(msg, "error");

  const [patients, setPatients] = useState<TPatient[]>([]);
  const [appointments, setAppointments] = useState<TAppointment[]>([]);
  const [myClinic, setMyClinic] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [appointmentPage, setAppointmentPage] = useState(1);
  const APPOINT_LIMIT = 5;

  const [patientPage, setPatientPage] = useState(1);
  const PATIENT_LIMIT = 10;

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    clinicId: "",
    doctorId: "",
    patientId: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    ReceptionistAPI.getMyClinic()
      .then((res) => {
        setMyClinic(res.data);
        setForm((prev) => ({ ...prev, clinicId: res.data.id }));
      })
      .catch(() => showError("Failed to load clinic"));
  }, []);

  useEffect(() => {
    ReceptionistAPI.listPatients()
      .then((res) => setPatients(res.data))
      .catch(() => showError("Failed to load patients"));
  }, []);

  useEffect(() => {
    ReceptionistAPI.listPendingAppointments()
      .then((res) => {
        const list = res.data.map((a: any) => ({
          id: a.id,
          patientName: a.patient?.name || "Unknown",
          doctorId: a.doctorId,
          startTime: a.startTime,
        }));

        setAppointments(list);
      })
      .catch(() => showError("Failed to load appointments"));
  }, []);

  useEffect(() => {
    if (!form.clinicId) {
      setDoctors([]);
      return;
    }

    ReceptionistAPI.listClinicDoctors(form.clinicId)
      .then((res) => setDoctors(res.data))
      .catch(() => showError("Failed to load doctors"));
  }, [form.clinicId]);

  useEffect(() => {
    if (!form.doctorId) {
      setAvailability([]);
      return;
    }

    ReceptionistAPI.getDoctorAvailability(form.doctorId)
      .then((res) => setAvailability(res.data))
      .catch(() => showError("Failed to load availability"));
  }, [form.doctorId]);

  const createAppointment = async (): Promise<void> => {
    try {
      await ReceptionistAPI.createAppointment(form);
      toast.show("Appointment scheduled successfully", "success");

      setForm({
        clinicId: myClinic?.id || "",
        doctorId: "",
        patientId: "",
        startTime: "",
        endTime: "",
        notes: "",
      });
    } catch {
      showError("Failed to create appointment");
    }
  };

  const acceptAppointment = async (id: string): Promise<void> => {
    try {
      await ReceptionistAPI.acceptAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.show("Appointment confirmed and scheduled", "success");
    } catch {
      showError("Failed to accept appointment");
    }
  };

  const handleCancel = (id: string): void => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmCancel = async (): Promise<void> => {
    if (!selectedId) return;

    try {
      await ReceptionistAPI.cancelAppointment(selectedId);
      setAppointments((prev) => prev.filter((a) => a.id !== selectedId));
      toast.show("Appointment cancelled", "success");
    } catch {
      showError("Failed to cancel appointment");
    }

    setConfirmOpen(false);
  };

  const handleEdit = (appt: any): void => {
    setEditData(appt);
    setEditOpen(true);
  };

  const saveEdit = async (updated: any): Promise<void> => {
    try {
      await ReceptionistAPI.updateAppointment(updated.id, updated);
      toast.show("Appointment updated", "success");
      setEditOpen(false);
    } catch {
      showError("Failed to update appointment");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedPatients = filteredPatients.slice(
    (patientPage - 1) * PATIENT_LIMIT,
    patientPage * PATIENT_LIMIT
  );

  const paginatedAppointments = appointments.slice(
    (appointmentPage - 1) * APPOINT_LIMIT,
    appointmentPage * APPOINT_LIMIT
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Receptionist Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage appointments & patients
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              onClick={() => navigate("/chatbot")}
            >
              AI Chatbot
            </button>

            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
              onClick={() => {
                logoutUser();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white font-semibold text-xl">
                Pending Appointments ({appointments.length})
              </div>

              <div className="p-6 space-y-4">
                {paginatedAppointments.map((a) => {
                  const patient = patients.find((p) => p.name === a.patientName);

                  return (
                    <div key={a.id} className="border p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-lg">{a.patientName}</h3>
                      <p className="text-gray-600 text-sm">{a.startTime}</p>

                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => acceptAppointment(a.id)}
                        >
                          ✓ Accept
                        </button>

                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleEdit(a)}
                        >
                          ✎ Edit
                        </button>

                        <button
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleCancel(a.id)}
                        >
                          ✕ Cancel
                        </button>

                        <button
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                          onClick={() =>
                            navigate("/billing/create", {
                              state: {
                                appointmentId: a.id,
                                patientId: patient?.id || "",
                                patientName: a.patientName,
                              },
                            })
                          }
                        >
                          💳 Bill
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-center items-center mt-4 space-x-4">
                  <button
                    disabled={appointmentPage === 1}
                    onClick={() => setAppointmentPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-gray-700 font-medium">
                    Page {appointmentPage} of{" "}
                    {Math.ceil(appointments.length / APPOINT_LIMIT) || 1}
                  </span>

                  <button
                    disabled={appointmentPage * APPOINT_LIMIT >= appointments.length}
                    onClick={() => setAppointmentPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white font-semibold text-xl">
                Patients
              </div>

              <div className="p-6">
                <input
                  placeholder="Search patient..."
                  className="w-full border px-3 py-2 rounded-lg mb-4"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {paginatedPatients.map((p) => (
                    <div
                      key={p.id}
                      className="border p-3 rounded-lg flex items-center"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        {p.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.email}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center mt-4 space-x-4">
                  <button
                    disabled={patientPage === 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPatientPage((p) => p - 1)}
                  >
                    Previous
                  </button>

                  <span className="text-gray-700 font-medium">
                    Page {patientPage} of{" "}
                    {Math.ceil(filteredPatients.length / PATIENT_LIMIT) || 1}
                  </span>

                  <button
                    disabled={patientPage * PATIENT_LIMIT >= filteredPatients.length}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPatientPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md sticky top-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white font-semibold text-xl">
                Create Appointment
              </div>

              <div className="p-6 space-y-4">
                {myClinic && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-purple-900">
                      Your Clinic:
                    </p>
                    <p className="text-lg font-bold text-purple-700">
                      {myClinic.name}
                    </p>
                  </div>
                )}

                <div>
                  <label>Doctor</label>
                  <select
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                    disabled={!form.clinicId}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d: any) => (
                      <option key={d.doctor.id} value={d.doctor.id}>
                        {d.doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {availability.length > 0 && (
                  <div className="bg-purple-50 border p-4 rounded-lg">
                    <p className="text-sm font-semibold">
                      Doctor Availability:
                    </p>
                    {availability.map((a: any, i: number) => (
                      <p key={i}>
                        Day {a.dayOfWeek}: {a.startTime} – {a.endTime}
                      </p>
                    ))}
                  </div>
                )}

                <div>
                  <label>Patient</label>
                  <select
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.patientId}
                    onChange={(e) =>
                      setForm({ ...form, patientId: e.target.value })
                    }
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    className="w-full border px-4 py-2 rounded-lg"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>Notes</label>
                  <textarea
                    className="w-full border px-4 py-2 rounded-lg"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg"
                  onClick={createAppointment}
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Need help or have any query?
          </p>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>
        </div>
      </footer>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmCancel}
      />

      {editOpen && (
        <EditAppointmentModal
          open={editOpen}
          appointment={editData}
          onClose={() => setEditOpen(false)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
