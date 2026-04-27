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

export type RegisterResponse = {
  message: string;
  requiresEmailVerification: boolean;
  verificationEmailSent: boolean;
  verificationEmailSentTo: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified?: boolean;
  };
};

export type ResendVerificationResponse = {
  message: string;
  success: boolean;
  sentTo?: string;
};

function getApiMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const response = (err as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) {
      return message.filter((item) => typeof item === "string").join("\n");
    }

    const errorMessage = (err as { message?: unknown }).message;
    if (typeof errorMessage === "string") return errorMessage;
  }

  return fallback;
}

// 🔐 Register
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}): Promise<RegisterResponse> {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("Register error:", err);
    throw new Error(getApiMessage(err, "Registration failed"));
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
    throw new Error(getApiMessage(err, "Login failed"));
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<ResendVerificationResponse> {
  try {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  } catch (err) {
    console.error("Resend verification error:", err);
    throw new Error(
      getApiMessage(err, "Could not resend verification email")
    );
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
