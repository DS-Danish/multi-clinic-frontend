import React, { useState, useEffect } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  CreateReportDto,
  UpdateReportDto,
  AppointmentReport,
} from "../../services/report.service";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportDto | UpdateReportDto) => Promise<void>;
  existingReport?: AppointmentReport | null;
  appointmentDetails?: {
    patientName: string;
    clinicName: string;
    date: string;
  };
  mode: "create" | "edit";
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingReport,
  appointmentDetails,
  mode,
}) => {
  const [formData, setFormData] = useState<CreateReportDto>({
    title: "",
    content: "",
    diagnosis: "",
    prescription: "",
    recommendations: "",
    fileUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingReport && mode === "edit") {
      setFormData({
        title: existingReport.title,
        content: existingReport.content,
        diagnosis: existingReport.diagnosis || "",
        prescription: existingReport.prescription || "",
        recommendations: existingReport.recommendations || "",
        fileUrl: existingReport.fileUrl || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        content: "",
        diagnosis: "",
        prescription: "",
        recommendations: "",
        fileUrl: "",
      });
    }
    setError("");
  }, [existingReport, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose(); // Close dialog after successful submission
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to save report. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "create" ? "Create" : "Edit"} Appointment Report
              </h2>
              {appointmentDetails && (
                <p className="text-sm text-gray-600">
                  {appointmentDetails.patientName} • {appointmentDetails.clinicName} •{" "}
                  {new Date(appointmentDetails.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Report Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Post-Consultation Report"
              maxLength={200}
              required
              className="mt-1"
              disabled={loading}
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-gray-700 font-medium">
              Report Content <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Detailed report content and observations..."
              required
              rows={5}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <Label htmlFor="diagnosis" className="text-gray-700 font-medium">
              Diagnosis
            </Label>
            <textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              placeholder="Medical diagnosis and findings..."
              rows={3}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Prescription */}
          <div>
            <Label htmlFor="prescription" className="text-gray-700 font-medium">
              Prescription
            </Label>
            <textarea
              id="prescription"
              value={formData.prescription}
              onChange={(e) =>
                setFormData({ ...formData, prescription: e.target.value })
              }
              placeholder="Prescribed medications and dosage..."
              rows={3}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Recommendations */}
          <div>
            <Label htmlFor="recommendations" className="text-gray-700 font-medium">
              Recommendations
            </Label>
            <textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({ ...formData, recommendations: e.target.value })
              }
              placeholder="Follow-up recommendations and lifestyle advice..."
              rows={3}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* File URL (Optional) */}
          <div>
            <Label htmlFor="fileUrl" className="text-gray-700 font-medium">
              Attachment URL (Optional)
            </Label>
            <Input
              id="fileUrl"
              type="url"
              value={formData.fileUrl}
              onChange={(e) =>
                setFormData({ ...formData, fileUrl: e.target.value })
              }
              placeholder="https://example.com/report.pdf"
              className="mt-1"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Link to external files or documents
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>{mode === "create" ? "Create Report" : "Update Report"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
