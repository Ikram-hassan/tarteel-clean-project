// ملف إدارة حالة المصادقة وصلاحيات المستخدم
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "teacher" | "student";

interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

// البنية المخزنة في localStorage لكل مستخدم مسجل
export interface StoredUser {
  name: string;
  email: string;
  role: UserRole;
  password: string; // يُستخدم للطلاب فقط
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  registerUser: (userData: StoredUser) => { success: boolean; error?: string };
  validateLogin: (
    name: string,
    role: UserRole,
    password: string
  ) => { success: boolean; user?: StoredUser; error?: string };
}

const STORAGE_KEY = "tarteel_registered_users";

const getStoredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // تسجيل مستخدم جديد وحفظه في localStorage
  const registerUser = (userData: StoredUser): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const exists = users.find(
      (u) =>
        u.name.trim().toLowerCase() === userData.name.trim().toLowerCase() &&
        u.role === userData.role
    );
    if (exists) {
      return {
        success: false,
        error: "An account with this name already exists for this role. Please log in instead.",
      };
    }
    users.push(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { success: true };
  };

  // التحقق من بيانات تسجيل الدخول مقابل الحسابات المسجلة
  const validateLogin = (
    name: string,
    role: UserRole,
    password: string
  ): { success: boolean; user?: StoredUser; error?: string } => {
    const users = getStoredUsers();
    const found = users.find(
      (u) =>
        u.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        u.role === role
    );
    if (!found) {
      return {
        success: false,
        error: "No account found with this name and role. Please register first.",
      };
    }
    // للطلاب: التحقق من كلمة المرور
    if (role === "student" && found.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    return { success: true, user: found };
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, registerUser, validateLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
