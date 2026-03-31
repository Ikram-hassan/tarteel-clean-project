import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import logoImg from "@assets/b5631c0e-bdc3-4a08-8584-9e6cbfec8cc2_1774916046934.jpg";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-tarteel-maroon text-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src={logoImg} alt="Tarteel E-Maqraa Logo" className="h-12 w-12 rounded-full object-cover border-2 border-tarteel-gold" />
          <div className="hidden md:block font-serif font-bold text-xl tracking-wide text-white">
            Tarteel <span className="text-tarteel-gold">E-Maqraa</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-tarteel-gold transition-colors">{t('home')}</Link>
          <Link href="/institute" className="hover:text-tarteel-gold transition-colors">{t('institute')}</Link>
          <Link href="/register" className="hover:text-tarteel-gold transition-colors">{t('register')}</Link>
          <Link href="/dashboard" className="hover:text-tarteel-gold transition-colors">{t('dashboard')}</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-tarteel-gold hover:bg-white/10 uppercase font-bold">
                {language}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('so')}>Soomaali</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white text-tarteel-maroon">
                <DropdownMenuItem asChild>
                  <Link href="/">{t('home')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/institute">{t('institute')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">{t('register')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t('dashboard')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
