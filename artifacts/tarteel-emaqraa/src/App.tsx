// الملف الرئيسي لإعداد التوجيه والمزودين
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider, useAuth, UserRole } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Institute from "@/pages/institute";
import Register from "@/pages/register";
import LiveClass from "@/pages/live-class";
import Certificates from "@/pages/certificates";
import StudentDashboard from "@/pages/dashboard-student";
import TeacherDashboard from "@/pages/dashboard-teacher";
import AdminDashboard from "@/pages/dashboard-admin";

const queryClient = new QueryClient();

// مكوّن الحماية: يتحقق من المصادقة قبل السماح بالوصول
function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/register" />;
  if (user?.role !== role) return <Redirect to="/register" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* الصفحات العامة */}
      <Route path="/" component={Home} />
      <Route path="/institute" component={Institute} />
      <Route path="/register" component={Register} />

      {/* لوحات التحكم المحمية حسب الدور */}
      <Route path="/dashboard/student">
        <ProtectedRoute role="student">
          <StudentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/teacher">
        <ProtectedRoute role="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/admin">
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      {/* صفحة الفصل المباشر والشهادات */}
      <Route path="/live-class" component={LiveClass} />
      <Route path="/certificates" component={Certificates} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
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
