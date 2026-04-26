import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillingAPI } from "../services/billing.service";
import { ReceptionistAPI } from "../services/receptionist.service";
import { useToast } from "../components/ui/ToastProvider";

interface Patient {
  id: string;
  name?: string;
  email?: string;
}

interface Appointment {
  id: string;
  patient?: Patient;
  doctor?: {
    name?: string;
  };
  appointmentDate?: string;
  appointmentTime?: string;
}

interface CreateBillForm {
  appointmentId: string;
  patientId: string;
  totalAmount: number;
  discount: number;
}

export default function CreateBillPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState<CreateBillForm>({
    appointmentId: "",
    patientId: "",
    totalAmount: 0,
    discount: 0,
  });

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);

        const [patientsRes, appointmentsRes] = await Promise.all([
          ReceptionistAPI.listPatients(),
          ReceptionistAPI.listPendingAppointments(),
        ]);

        const patientsData = Array.isArray(patientsRes.data)
          ? patientsRes.data
          : patientsRes.data?.data ?? [];

        const appointmentsData = Array.isArray(appointmentsRes.data)
          ? appointmentsRes.data
          : appointmentsRes.data?.data ?? [];

        setPatients(patientsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("LOAD BILLING DATA ERROR:", error);
        toast.show("Failed to load patients or appointments", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAppointmentChange = (appointmentId: string): void => {
    const selectedAppointment = appointments.find(
      (appointment) => appointment.id === appointmentId
    );

    setForm((prev) => ({
      ...prev,
      appointmentId,
      patientId: selectedAppointment?.patient?.id || prev.patientId,
    }));
  };

  const submit = async (): Promise<void> => {
    console.log("CREATE BILL CLICKED", form);

    if (!form.appointmentId) {
      toast.show("Please select an appointment", "error");
      return;
    }

    if (!form.patientId) {
      toast.show("Please select a patient", "error");
      return;
    }

    if (!form.totalAmount || form.totalAmount <= 0) {
      toast.show("Total amount must be greater than 0", "error");
      return;
    }

    if (form.discount < 0) {
      toast.show("Discount cannot be negative", "error");
      return;
    }

    if (form.discount > form.totalAmount) {
      toast.show("Discount cannot be greater than total amount", "error");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        appointmentId: form.appointmentId,
        patientId: form.patientId,
        totalAmount: Number(form.totalAmount),
        discount: Number(form.discount || 0),
      };

      console.log("CREATE BILL PAYLOAD", payload);

      const res = await BillingAPI.createBill(payload);

      console.log("CREATE BILL RESPONSE", res.data);

      toast.show("Bill created successfully", "success");

      if (res.data?.id) {
        navigate(`/billing/${res.data.id}`);
      }
    } catch (error: any) {
      console.error("CREATE BILL ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create bill";

      toast.show(Array.isArray(message) ? message[0] : message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const payableAmount = Math.max(
    0,
    Number(form.totalAmount || 0) - Number(form.discount || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Bill</h1>
          <p className="mt-1 text-gray-500">
            Generate a billing invoice for a patient appointment.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Appointment
                </label>

                <select
                  value={form.appointmentId}
                  onChange={(event) =>
                    handleAppointmentChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select appointment</option>

                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.patient?.name || "Unknown Patient"} -{" "}
                      {appointment.doctor?.name || "Unknown Doctor"} -{" "}
                      {appointment.appointmentDate
                        ? new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()
                        : "No date"}
                    </option>
                  ))}
                </select>

                {appointments.length === 0 && (
                  <p className="mt-2 text-sm text-orange-600">
                    No pending appointments found.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Patient
                </label>

                <select
                  value={form.patientId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      patientId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select patient</option>

                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name || patient.email || patient.id}
                    </option>
                  ))}
                </select>

                {patients.length === 0 && (
                  <p className="mt-2 text-sm text-orange-600">
                    No patients found.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Amount
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={form.totalAmount}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        totalAmount: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter total amount"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={form.discount}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        discount: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter discount"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payable Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    {payableAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Bill"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
