"use client";

import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/b5631c0e-bdc3-4a08-8584-9e6cbfec8cc2_1774916046934.jpg";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LayoutDashboard, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "so", label: "SO" },
] as const;

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // حساب رابط لوحة التحكم بناءً على دور المستخدم (بما في ذلك المختبر)
  const dashboardPath = useMemo(() => {
    if (!user) return "/register";

    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "teacher":
      case "interviewer": // المختبر يتوجه الآن لنفس لوحة تحكم المعلم
        return "/dashboard/teacher";
      case "student":
        return "/dashboard/student";
      default:
        return "/";
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-tarteel-maroon text-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src={logoImg}
            alt="Tarteel E-Maqraa Logo"
            className="h-12 w-12 rounded-full object-cover border-2 border-tarteel-gold"
          />
          <div className="hidden md:block font-serif font-bold text-xl tracking-wide text-white">
            Tarteel <span className="text-tarteel-gold">E-Maqraa</span>
          </div>
        </Link>

        {/* روابط التنقل - سطح المكتب */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-tarteel-gold transition-colors cursor-pointer">
            {t("home")}
          </Link>
          <Link href="/institute" className="hover:text-tarteel-gold transition-colors cursor-pointer">
            {t("institute")}
          </Link>

          {/* إظهار زر تسجيل الدخول أو رابط لوحة التحكم */}
          {!isAuthenticated ? (
            <Link
              href="/register"
              className="bg-[#E07B39] hover:bg-[#E07B39]/90 text-white px-5 py-2 rounded-full font-bold transition-colors cursor-pointer"
            >
              {t("login")}
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 hover:text-tarteel-gold transition-colors cursor-pointer"
              >
                <LayoutDashboard size={18} />
                {t("dashboard")}
              </Link>
              <div className="h-5 w-px bg-white/30" />
              <span className="text-tarteel-gold font-medium text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 hover:text-red-300 transition-colors"
                data-testid="button-logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </nav>

        {/* الأزرار اليمنى (مبدل اللغة وقائمة الجوال) */}
        <div className="flex items-center gap-1">
          <Globe size={16} className="text-white/60 mr-1" />
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-2.5 py-1 rounded text-sm font-bold transition-colors ${
                language === code
                  ? "bg-tarteel-gold text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}

          {/* قائمة الهاتف */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white text-tarteel-maroon">
                <DropdownMenuItem asChild>
                  <Link href="/">{t("home")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/institute">{t("institute")}</Link>
                </DropdownMenuItem>
                {!isAuthenticated ? (
                  <DropdownMenuItem asChild>
                    <Link href="/register">{t("login")}</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={dashboardPath}>
                        <div className="flex items-center gap-2 w-full">
                          <LayoutDashboard size={16} />
                          {t("dashboard")}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <div className="flex items-center gap-2 w-full">
                        <LogOut size={16} />
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}