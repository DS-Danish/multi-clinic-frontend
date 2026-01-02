import api from "./api";

export type CreateClinicWithAdminPayload = {
  clinicName: string;
  clinicCode: string;
  clinicEmail: string;
  clinicPhone: string;

  adminName: string;
  adminEmail: string;
  adminPassword: string;
};

export type CreateClinicDto = {
  name: string;
  code: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
};

export async function createClinicWithAdmin(payload: CreateClinicWithAdminPayload) {
  const res = await api.post("/super-admin/create-clinic-with-admin", payload);
  return res.data;
}

export async function createClinic(payload: CreateClinicDto) {
  const res = await api.post("/clinics", payload);
  return res.data;
}
