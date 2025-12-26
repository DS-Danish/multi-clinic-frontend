import api from "./api";

export const BillingAPI = {
  createBill: (data: {
    appointmentId: string;
    patientId: string;
    totalAmount: number;
    discount?: number;
  }) => api.post("/billing", data),

  getBill: (id: string) => api.get(`/billing/${id}`),

  payBill: (billId: string, data: { amount: number; method: string }) =>
    api.post(`/billing/${billId}/pay`, data),

  getPatientBills: (patientId: string) =>
    api.get(`/billing/patient/${patientId}`),

  getClinicBills: (clinicId: string) =>
    api.get(`/billing/clinic/${clinicId}`),
};
