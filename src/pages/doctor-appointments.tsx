import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { getCurrentUser } from "../utils/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { User, FileText, Edit, Eye, Plus, Trash2 } from "lucide-react";
import DoctorLayout from "../components/DoctorLayout";
import { ReportDialog } from "../components/ui/ReportDialog";
import {
  ReportService,
  AppointmentReport,
  CreateReportDto,
  UpdateReportDto,
} from "../services/report.service";
import { useToast } from "../components/ui/ToastProvider";

type TAppointment = {
  id: string;
  patientName: string;
  clinicName: string;
  startTime: string;
  endTime: string;
  report?: AppointmentReport;
};

const DoctorAppointmentsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<TAppointment[]>([]);
  const [filtered, setFiltered] = useState<TAppointment[]>([]);
  const [search, setSearch] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [existingReport, setExistingReport] = useState<AppointmentReport | null>(null);
  const [reportMode, setReportMode] = useState<"create" | "edit">("create");
  const [viewReportDialog, setViewReportDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<TAppointment | null>(null);
  const toast = useToast();

  const loadAppointments = useCallback(async (doctorId: string): Promise<void> => {
    try {
      const res = await api.get(`/appointments/doctor/${doctorId}`);
      setAppointments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
      toast.show("Failed to load appointments", "error");
    }
  }, [toast]);

  useEffect(() => {
    const current = getCurrentUser();

    if (!current || current.role !== "DOCTOR") {
      window.location.href = "/login";
      return;
    }

    setUser(current);
    loadAppointments(current.id);
  }, [loadAppointments]);

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

  const handleCreateReport = (appointment: TAppointment) => {
    setSelectedAppointment(appointment);
    setExistingReport(null);
    setReportMode("create");
    setReportDialogOpen(true);
  };

  const handleEditReport = (appointment: TAppointment) => {
    if (!appointment.report) {
      toast.show("No report found", "error");
      return;
    }
    setSelectedAppointment(appointment);
    setExistingReport(appointment.report);
    setReportMode("edit");
    setReportDialogOpen(true);
  };

  const handleViewReport = (appointment: TAppointment) => {
    if (!appointment.report) {
      toast.show("No report found", "error");
      return;
    }
    setSelectedAppointment(appointment);
    setExistingReport(appointment.report);
    setViewReportDialog(true);
  };

  const handleSubmitReport = async (data: CreateReportDto | UpdateReportDto) => {
    if (!selectedAppointment) return;

    try {
      if (reportMode === "create") {
        await ReportService.createReport(selectedAppointment.id, data as CreateReportDto);
        toast.show("Report created successfully", "success");
      } else {
        await ReportService.updateReport(selectedAppointment.id, data as UpdateReportDto);
        toast.show("Report updated successfully", "success");
      }
      
      // Close the dialog
      setReportDialogOpen(false);
      setSelectedAppointment(null);
      setExistingReport(null);
      
      // Reload appointments to update report status
      if (user) {
        await loadAppointments(user.id);
      }
    } catch (err: any) {
      console.error("Failed to save report", err);
      throw err; // Re-throw to let dialog handle it
    }
  };

  const handleDeleteReport = (appointment: TAppointment) => {
    setAppointmentToDelete(appointment);
    setDeleteConfirmDialog(true);
  };

  const confirmDeleteReport = async () => {
    if (!appointmentToDelete) return;

    try {
      await ReportService.deleteReport(appointmentToDelete.id);
      toast.show("Report deleted successfully", "success");
      setDeleteConfirmDialog(false);
      setAppointmentToDelete(null);
      
      // Reload appointments to update report status
      if (user) {
        await loadAppointments(user.id);
      }
    } catch (err: any) {
      console.error("Failed to delete report", err);
      toast.show("Failed to delete report", "error");
    }
  };

  if (!user) return null;

  return (
    <DoctorLayout userName={user.name}>
      <div className="p-6 lg:p-8">
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
                <th className="px-4 py-3 text-left">Report</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {a.report ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReport(a)}
                              className="text-xs"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditReport(a)}
                              className="text-xs"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReport(a)}
                              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleCreateReport(a)}
                            className="text-xs"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Report
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Report Dialog for Create/Edit */}
        <ReportDialog
          isOpen={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSubmit={handleSubmitReport}
          existingReport={existingReport}
          appointmentDetails={
            selectedAppointment
              ? {
                  patientName: selectedAppointment.patientName,
                  clinicName: selectedAppointment.clinicName,
                  date: selectedAppointment.startTime,
                }
              : undefined
          }
          mode={reportMode}
        />

        {/* View Report Dialog */}
        {viewReportDialog && existingReport && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {existingReport.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedAppointment.patientName} • {selectedAppointment.clinicName} •{" "}
                      {new Date(selectedAppointment.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewReportDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close dialog"
                >
                  <User className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{existingReport.content}</p>
                </div>
                
                {existingReport.diagnosis && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{existingReport.diagnosis}</p>
                  </div>
                )}
                
                {existingReport.prescription && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prescription</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{existingReport.prescription}</p>
                  </div>
                )}
                
                {existingReport.recommendations && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{existingReport.recommendations}</p>
                  </div>
                )}
                
                {existingReport.fileUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Attachment</h3>
                    <a
                      href={existingReport.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {existingReport.fileUrl}
                    </a>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setViewReportDialog(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setViewReportDialog(false);
                      handleEditReport(selectedAppointment);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmDialog && appointmentToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Report?</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the report for <strong>{appointmentToDelete.patientName}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmDialog(false);
                    setAppointmentToDelete(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteReport}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Report
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointmentsPage;
