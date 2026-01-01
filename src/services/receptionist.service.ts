import api from "./api";

export const getMyClinic = () => api.get("/receptionist/my-clinic");
export const listPatients = () => api.get("/receptionist/patients");
export const listClinics = () => api.get("/clinics");
export const listClinicDoctors = (clinicId: string) => api.get(`/receptionist/clinics/${clinicId}/doctors`);
export const getDoctorAvailability = (doctorId: string) => api.get(`/receptionist/doctors/${doctorId}/availability`);

export const createAppointment = (data: any) =>
  api.post("/receptionist/appointments", data);

export const acceptAppointment = (id: string) =>
  api.patch(`/receptionist/appointments/${id}/accept`);

export const cancelAppointment = (id: string) =>
  api.patch(`/receptionist/appointments/${id}/cancel`);

export const updateAppointment = (id: string, data: any) =>
  api.patch(`/receptionist/appointments/${id}`, data);

export const listPendingAppointments = (page = 1, search = "") =>
  api.get(`/receptionist/appointments/pending?page=${page}&search=${search}`);

export const ReceptionistAPI = {
  getMyClinic,
  listPatients,
  listClinics,
  listClinicDoctors,
  getDoctorAvailability,
  createAppointment,
  acceptAppointment,
  cancelAppointment,
  updateAppointment,
  listPendingAppointments,
};
