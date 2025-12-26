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

export async function createClinicWithAdmin(payload: CreateClinicWithAdminPayload) {
  const res = await api.post("/super-admin/create-clinic-with-admin", payload);
  return res.data;
}
