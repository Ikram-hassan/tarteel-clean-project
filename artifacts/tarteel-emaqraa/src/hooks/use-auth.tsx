"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  useRegisterStudent,
  useRegisterTeacher,
} from "@workspace/api-client-react";
import { auth as firebaseAuth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export type UserRole = "admin" | "teacher" | "student" | "interviewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  role: UserRole;
  languages?: string[];
  selectedDays?: string[];
  selectedSections?: string[];
  monthlyFee?: number;
  isOnline?: boolean;
  attendanceStats?: {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    lastAttendance: string | null;
  };
  academicProgress?: {
    currentSurah: string;
    lastPage: number;
    evaluationGrade: string;
    teacherNotes: string;
  };
  paymentStatus?: "paid" | "unpaid" | "pending";
  trialEndDate?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: AuthUser | null }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUserContext: (data: Partial<AuthUser>) => void;
}

const SESSION_KEY = "tarteel_current_session";

// ✅ Safe API URL — never falls back to localhost in production
const getApiBaseUrl = (): string => {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;

  if (fromEnv && fromEnv.trim() !== "") {
    const url = fromEnv.trim().replace(/\/+$/, "");
    // Block localhost in production build
    if (import.meta.env.PROD && url.includes("localhost")) {
      console.error(
        "[Auth] VITE_API_URL points to localhost in production! Falling back to relative /api",
      );
      return "/api";
    }
    return url;
  }

  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

console.log(`[Auth] API_BASE_URL resolved to: "${API_BASE_URL}"`);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const registerStudentMutation = useRegisterStudent();
  const registerTeacherMutation = useRegisterTeacher();

  const registerAdminDirectly = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {}

    if (!response.ok) {
      throw new Error(responseData?.error || "Admin registration failed");
    }
    return responseData;
  };

  const fetchDbUser = async (uid: string): Promise<AuthUser | null> => {
    try {
      // ✅ Guard: never call localhost in production
      if (import.meta.env.PROD && API_BASE_URL.includes("localhost")) {
        console.error(
          "[Auth] Blocked fetchDbUser — API_BASE_URL is localhost in production",
        );
        return null;
      }

      console.log(`[Auth] fetchDbUser → POST ${API_BASE_URL}/api/auth/login`);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: uid }),
      });

      if (!response.ok) {
        console.warn(`[Auth] fetchDbUser failed — status: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("[Auth] fetchDbUser error:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // Load cached session immediately for fast UI
          const savedSession = localStorage.getItem(SESSION_KEY);
          if (savedSession) {
            try {
              setUser(JSON.parse(savedSession));
            } catch {
              localStorage.removeItem(SESSION_KEY);
            }
          }

          // Then fetch fresh data from DB
          const dbUser = await fetchDbUser(firebaseUser.uid);
          if (dbUser) {
            setUser(dbUser);
            localStorage.setItem(SESSION_KEY, JSON.stringify(dbUser));
          } else if (!savedSession) {
            // No DB data and no cache — clear state
            setUser(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
        }
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password.trim(),
      );
      const dbUserData = await fetchDbUser(userCredential.user.uid);
      if (!dbUserData) throw new Error("User not found in database");
      setUser(dbUserData);
      localStorage.setItem(SESSION_KEY, JSON.stringify(dbUserData));
      return { user: dbUserData };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (values: any) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        values.email.trim(),
        values.password,
      );
      const uid = userCredential.user.uid;
      let resultUser: AuthUser;

      if (values.role === "admin") {
        const response = await registerAdminDirectly({
          id: uid,
          name: values.name,
          email: values.email.toLowerCase().trim(),
          phone: values.phone,
          gender: values.gender,
          role: "admin",
          verificationCode: values.verificationCode,
        });
        resultUser = { ...values, id: uid, ...response } as AuthUser;
      } else if (values.role === "student") {
        const response: any = await registerStudentMutation.mutateAsync({
          data: {
            id: uid,
            name: values.name,
            email: values.email.toLowerCase().trim(),
            phone: values.phone,
            age: Number(values.age),
            gender: values.gender as "male" | "female",
            language: values.language || "ar",
            selectedDays: values.selectedDays || [],
            selectedSections: values.selectedSections || [],
            monthlyFee: String(values.monthlyFee || "0"),
          },
        } as any);

        resultUser = {
          ...(response.data || response),
          role: "student",
          academicProgress: {
            currentSurah: "الفاتحة",
            lastPage: 0,
            evaluationGrade: "جديد",
            teacherNotes: "",
          },
        } as AuthUser;
      } else if (values.role === "teacher" || values.role === "interviewer") {
        const teacherPayload: any = {
          id: uid,
          name: values.name,
          email: values.email.toLowerCase().trim(),
          phone: values.phone,
          gender: values.gender as "male" | "female",
          role: values.role as "teacher" | "interviewer",
          verificationCode: values.verificationCode,
          selectedDays: values.selectedDays || [],
          selectedSections: values.selectedSections || [],
        };

        if (values.role === "teacher" && values.teacherType) {
          teacherPayload.teacherType = values.teacherType;
          if (values.teacherType === "intermediate" && values.juzRange) {
            teacherPayload.juzRange = Number(values.juzRange);
          }
          if (values.teacherType === "ijaza" && values.qiraatSpecialization) {
            teacherPayload.qiraatSpecialization = values.qiraatSpecialization;
          }
        }

        if (values.role === "interviewer" && values.interviewerType) {
          teacherPayload.interviewerType = values.interviewerType;
        }

        console.log("[Auth] Teacher/Interviewer Payload:", teacherPayload);

        const response: any = await registerTeacherMutation.mutateAsync({
          data: teacherPayload,
        });

        console.log("[Auth] Registration Response:", response);
        resultUser = { ...(response.data || response) } as AuthUser;
      } else {
        throw new Error("Unsupported role");
      }

      setUser(resultUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(resultUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUserContext = (data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoading:
          isLoading ||
          registerStudentMutation.isPending ||
          registerTeacherMutation.isPending,
        isAuthenticated: !!user,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
