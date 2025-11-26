import api from "../services/api";

export type UserRole =
  | "SYSTEM_ADMIN"
  | "CLINIC_ADMIN"
  | "DOCTOR"
  | "PATIENT"
  | "RECEPTIONIST";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

// 🔐 Register
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}) {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("Register error:", err);
    return null;
  }
}

// 🔐 Login
export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.accessToken;
    const user = res.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    return user;
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
}

// 🔐 Logout
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}

// Get logged-in user
export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// Get token
export function getToken(): string | null {
  return localStorage.getItem("token");
}
