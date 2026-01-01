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
    phone: string | null;
    isActive: boolean;
    role: UserRole;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
}

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
  password: string,
  role: UserRole
): Promise<AuthUser | null> {
  try {
    const res = await api.post("/auth/login", { email, password, role });

    const token = res.data.accessToken;
    const user = res.data.user;

    // Store complete user data (excluding password for security)
    const userToStore: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      role: user.role,
      password: null, // Never store password in localStorage
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));

    return userToStore;
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

// 👤 Get logged-in user
export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// 🔑 Get token
export function getToken(): string | null {
  return localStorage.getItem("token");
}
