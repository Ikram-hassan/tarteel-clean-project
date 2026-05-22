"use client";

import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider, useAuth, UserRole } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// استيراد الصفحات
import Home from "@/pages/home";
import Institute from "@/pages/institute";
import Register from "@/pages/register";
import LiveClass from "@/pages/live-class";
import Certificates from "@/pages/certificates";
import StudentDashboard from "@/pages/dashboard-student";
import UnifiedDashboard from "@/pages/dashboard-unified";
import TeacherDashboard from "@/pages/dashboard-teacher";
import AdminDashboard from "@/pages/dashboard-admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * مكون حماية المسارات (ProtectedRoute)
 * يقوم بالتحقق من هوية المستخدم ورتبته قبل السماح له بالدخول
 */
function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-tarteel-maroon border-t-transparent"></div>
          <p className="text-sm font-bold text-tarteel-maroon animate-pulse uppercase tracking-widest">
            جاري التحقق من الصلاحيات...
          </p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجلاً، يتم توجيهه لصفحة التسجيل
  if (!isAuthenticated || !user) {
    return <Redirect to="/register" />;
  }

  // التحقق مما إذا كانت رتبته تسمح له بدخول هذا المسار
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    // توجيه تلقائي للوحة التحكم المناسبة لرتبته في حال حاول دخول مسار غير مسموح
    if (user.role === "admin") return <Redirect to="/dashboard" />;
    if (user.role === "teacher" || user.role === "interviewer")
      return <Redirect to="/dashboard" />;
    if (user.role === "student") return <Redirect to="/dashboard/student" />;
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/institute" component={Institute} />

      {/* إذا كان المستخدم مسجلاً بالفعل، يتم توجيهه للوحة تحكمه بدلاً من صفحة التسجيل */}
      <Route path="/register">
        {() => {
          if (isAuthenticated && user) {
            if (user.role === "student")
              return <Redirect to="/dashboard/student" />;
            return <Redirect to="/dashboard" />;
          }
          return <Register />;
        }}
      </Route>

      <Route path="/certificates" component={Certificates} />

      {/* لوحة تحكم الطالب */}
      <Route path="/dashboard/student">
        {() => (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        )}
      </Route>

      {/* لوحة تحكم موحدة للمعلم والمختبر والمدير */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute allowedRoles={["teacher", "interviewer", "admin"]}>
            <UnifiedDashboard />
          </ProtectedRoute>
        )}
      </Route>

      {/* لوحة تحكم المعلم (قديمة - للتوافق المؤقت) */}
      <Route path="/dashboard/teacher">
        {() => (
          <ProtectedRoute allowedRoles={["teacher", "interviewer"]}>
            <Redirect to="/dashboard" />
          </ProtectedRoute>
        )}
      </Route>

      {/* لوحة تحكم المدير (قديمة - للتوافق المؤقت) */}
      <Route path="/dashboard/admin">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Redirect to="/dashboard" />
          </ProtectedRoute>
        )}
      </Route>

      {/* مسارات الحلقات المباشرة (Live Class) */}
      <Route path="/live-class/:id">
        {(params: { id: string }) => (
          <ProtectedRoute
            allowedRoles={["teacher", "student", "interviewer", "admin"]}
          >
            <LiveClass roomId={params.id} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/live-class">
        {() => (
          <ProtectedRoute
            allowedRoles={["teacher", "student", "interviewer", "admin"]}
          >
            <LiveClass />
          </ProtectedRoute>
        )}
      </Route>

      {/* صفحة 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // التعامل مع مسار الـ Base لضمان التوافق مع استضافات مختلفة
  const basePath =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL?.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
