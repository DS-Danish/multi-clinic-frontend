import api from "./api";

export interface CreateReportDto {
  title: string;
  content: string;
  diagnosis?: string;
  prescription?: string;
  recommendations?: string;
  fileUrl?: string;
}

export interface UpdateReportDto {
  title?: string;
  content?: string;
  diagnosis?: string;
  prescription?: string;
  recommendations?: string;
  fileUrl?: string;
}

export interface AppointmentReport {
  id: string;
  appointmentId: string;
  doctorId: string;
  title: string;
  content: string;
  diagnosis?: string;
  prescription?: string;
  recommendations?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientReportResponse {
  appointmentId: string;
  appointmentDate: string;
  doctor: {
    id: string;
    name: string;
    email: string;
  };
  clinic: {
    id: string;
    name: string;
  };
  report: AppointmentReport;
}

export const ReportService = {
  /**
   * Create a report for an appointment
   */
  createReport: async (
    appointmentId: string,
    data: CreateReportDto
  ): Promise<AppointmentReport> => {
    const response = await api.post(
      `/appointments/${appointmentId}/report`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing report
   */
  updateReport: async (
    appointmentId: string,
    data: UpdateReportDto
  ): Promise<AppointmentReport> => {
    const response = await api.put(
      `/appointments/${appointmentId}/report`,
      data
    );
    return response.data;
  },

  /**
   * Delete a report for an appointment
   */
  deleteReport: async (appointmentId: string): Promise<void> => {
    await api.delete(`/appointments/${appointmentId}/report`);
  },

  /**
   * Get report for a specific appointment
   */
  getAppointmentReport: async (
    appointmentId: string
  ): Promise<AppointmentReport> => {
    const response = await api.get(`/appointments/${appointmentId}/report`);
    return response.data;
  },

  /**
   * Get all reports created by a doctor
   */
  getDoctorReports: async (doctorId: string): Promise<AppointmentReport[]> => {
    const response = await api.get(`/appointments/doctor/${doctorId}/reports`);
    return response.data;
  },

  /**
   * Get all reports for a patient
   */
  getPatientReports: async (patientId: string): Promise<PatientReportResponse[]> => {
    const response = await api.get(
      `/appointments/patient/${patientId}/reports`
    );
    return response.data;
  },
};
