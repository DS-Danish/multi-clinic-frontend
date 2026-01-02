import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import { FileText, Eye, ExternalLink, Trash2 } from "lucide-react";
import DoctorLayout from "../components/DoctorLayout";
import { Button } from "../components/ui/button";
import { ReportService, AppointmentReport } from "../services/report.service";
import { useToast } from "../components/ui/ToastProvider";

const DoctorReportsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<AppointmentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AppointmentReport | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<AppointmentReport | null>(null);
  const toast = useToast();

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
      const data = await ReportService.getDoctorReports(doctorId);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleViewReport = (report: AppointmentReport) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleDeleteReport = (report: AppointmentReport) => {
    setReportToDelete(report);
    setDeleteConfirmDialog(true);
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete || !user) return;

    try {
      await ReportService.deleteReport(reportToDelete.appointmentId);
      toast.show("Report deleted successfully", "success");
      setDeleteConfirmDialog(false);
      setReportToDelete(null);
      
      // Reload reports
      await fetchReports(user.id);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Reports</h1>
        <p className="text-gray-600 mb-6">
          Review all reports generated for your appointments.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Actions</th>
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
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">{r.title}</span>
                          {r.diagnosis && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {r.diagnosis.substring(0, 50)}
                              {r.diagnosis.length > 50 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReport(r)}
                          className="text-xs"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReport(r)}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Report Dialog */}
        {viewDialogOpen && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedReport.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(selectedReport.createdAt).toLocaleString()} • 
                      Updated: {new Date(selectedReport.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Report Content
                  </h3>
                  <p className="text-blue-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.content}
                  </p>
                </div>
                
                {selectedReport.diagnosis && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Diagnosis</h3>
                    <p className="text-red-800 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.diagnosis}
                    </p>
                  </div>
                )}
                
                {selectedReport.prescription && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Prescription</h3>
                    <p className="text-green-800 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.prescription}
                    </p>
                  </div>
                )}
                
                {selectedReport.recommendations && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Recommendations</h3>
                    <p className="text-yellow-800 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.recommendations}
                    </p>
                  </div>
                )}
                
                {selectedReport.fileUrl && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Attachment</h3>
                    <a
                      href={selectedReport.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {selectedReport.fileUrl}
                    </a>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setViewDialogOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmDialog && reportToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Report?</h2>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the following report?
              </p>
              <p className="font-semibold text-gray-900 mb-6">"{reportToDelete.title}"</p>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmDialog(false);
                    setReportToDelete(null);
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

export default DoctorReportsPage;
