import api from "./api";

export interface AddReceptionistDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AddDoctorDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialityIds?: string[];
}

export const addReceptionist = (clinicId: string, data: AddReceptionistDto) =>
  api.post(`/clinics/${clinicId}/receptionist`, data);

export const addDoctor = (clinicId: string, data: AddDoctorDto) =>
  api.post(`/clinics/${clinicId}/doctor`, data);

export const getMyClinic = () => 
  api.get("/clinics/my-clinic");

export const getClinicDoctors = (clinicId: string) =>
  api.get(`/clinics/${clinicId}/doctors`);

export const getClinicPatients = (clinicId: string) =>
  api.get(`/clinics/${clinicId}/patients`);

export const getClinicAppointments = (clinicId: string) =>
  api.get(`/clinics/${clinicId}/appointments`);

export const getClinicReceptionists = (clinicId: string) =>
  api.get(`/clinics/${clinicId}/receptionists`);

export const ClinicAdminAPI = {
  addReceptionist,
  addDoctor,
  getMyClinic,
  getClinicDoctors,
  getClinicPatients,
  getClinicAppointments,
  getClinicReceptionists,
};
