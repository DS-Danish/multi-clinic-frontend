import api from "./api";

export interface AddReceptionistDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const addReceptionist = (clinicId: string, data: AddReceptionistDto) =>
  api.post(`/clinics/${clinicId}/receptionist`, data);

export const getMyClinic = () => 
  api.get("/clinics/my-clinic");

export const ClinicAdminAPI = {
  addReceptionist,
  getMyClinic,
};
