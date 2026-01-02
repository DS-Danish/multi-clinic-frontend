import api from "./api";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "SYSTEM_ADMIN" | "CLINIC_ADMIN" | "DOCTOR" | "PATIENT" | "RECEPTIONIST";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function loginUser(payload: LoginPayload) {
  const res = await api.post("/auth/login", payload);

  const token = res.data?.accessToken;
  if (token) localStorage.setItem("token", token);

  return res.data;
}

export async function verifyEmail(token: string) {
  const res = await api.get(`/auth/verify-email?token=${token}`);
  return res.data;
}
