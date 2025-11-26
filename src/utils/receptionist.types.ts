export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export type Appointment = {
  id?: string;
  clinicId: string;
  doctorId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
};

export type Bill = {
  appointmentId: string;
  totalAmount: number;
  discount?: number;
  patientId?: string;
};

export type Payment = {
  billId: string;
  amount: number;
  method: string;
};
