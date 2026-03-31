import { useLanguage } from "@/hooks/use-language";
import logoImg from "@assets/b5631c0e-bdc3-4a08-8584-9e6cbfec8cc2_1774916046934.jpg";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-tarteel-maroon text-white pt-16 pb-8 border-t-[6px] border-tarteel-gold">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src={logoImg} alt="Tarteel Logo" className="h-16 w-16 rounded-full border-2 border-tarteel-gold" />
              <span className="font-serif font-bold text-2xl">Tarteel E-Maqraa</span>
            </Link>
            <p className="text-white/80 max-w-md leading-relaxed mb-6">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tarteel-gold hover:text-tarteel-maroon transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tarteel-gold hover:text-tarteel-maroon transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tarteel-gold hover:text-tarteel-maroon transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xl text-tarteel-gold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-tarteel-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/80 hover:text-tarteel-gold">{t('home')}</Link></li>
              <li><Link href="/institute" className="text-white/80 hover:text-tarteel-gold">{t('institute')}</Link></li>
              <li><Link href="/register" className="text-white/80 hover:text-tarteel-gold">{t('register')}</Link></li>
              <li><Link href="/dashboard" className="text-white/80 hover:text-tarteel-gold">{t('dashboard')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl text-tarteel-gold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-tarteel-gold">{t('contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/80">
                <Phone className="mt-1 text-tarteel-gold shrink-0" size={18} />
                <span>+252 619848866</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Mail className="mt-1 text-tarteel-gold shrink-0" size={18} />
                <span>info@tarteel-emaqraa.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="mt-1 text-tarteel-gold shrink-0" size={18} />
                <span>Mogadishu, Somalia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          &copy; {new Date().getFullYear()} Tarteel E-Maqraa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
