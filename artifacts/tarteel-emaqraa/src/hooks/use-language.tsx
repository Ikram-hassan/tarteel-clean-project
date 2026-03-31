import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar' | 'so';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    home: 'Home',
    institute: 'Institute',
    register: 'Register',
    dashboard: 'Dashboard',
    login: 'Login',
    startLearning: 'Start Learning',
    heroTagline: 'First Platform in the World Using the Somali Saba\' System to Produce Skilled Students',
    howToRegister: 'How to Register',
    learningLevels: 'Learning Levels',
    aboutUs: 'About Us',
    testimonials: 'Scholars Testimonials',
    contact: 'Contact Us',
    beginner: 'Beginner (Tajweed)',
    intermediate: 'Intermediate (Hifz & Review)',
    advanced: 'Advanced (Ijaza)',
    step1: 'Choose Role',
    step2: 'Fill Info',
    step3: 'Verify',
    step4: 'Start Learning',
    footerDesc: 'Tarteel E-Maqraa - Advanced Global Quran Learning Platform based in Mogadishu, Somalia.',
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
    dashboardTitle: 'Dashboard',
    liveClass: 'Live Class',
    certificates: 'Certificates',
  },
  ar: {
    home: 'الرئيسية',
    institute: 'المعهد',
    register: 'تسجيل',
    dashboard: 'لوحة القيادة',
    login: 'دخول',
    startLearning: 'ابدأ التعلم',
    heroTagline: 'المنصة الأولى في العالم التي تستخدم نظام السبع الصومالي لتخريج طلاب متقنين',
    howToRegister: 'كيفية التسجيل',
    learningLevels: 'مستويات التعلم',
    aboutUs: 'معلومات عنا',
    testimonials: 'شهادات العلماء',
    contact: 'اتصل بنا',
    beginner: 'مبتدئ (تجويد)',
    intermediate: 'متوسط (حفظ ومراجعة)',
    advanced: 'متقدم (إجازة)',
    step1: 'اختر الدور',
    step2: 'املأ البيانات',
    step3: 'تحقق',
    step4: 'ابدأ التعلم',
    footerDesc: 'ترتيل المقرأة - منصة عالمية متقدمة لتعلم القرآن مقرها مقديشو، الصومال.',
    admin: 'مدير',
    teacher: 'معلم',
    student: 'طالب',
    dashboardTitle: 'لوحة القيادة',
    liveClass: 'الفصل المباشر',
    certificates: 'الشهادات',
  },
  so: {
    home: 'Bogga Hore',
    institute: 'Machadka',
    register: 'Isdiiwaangeli',
    dashboard: 'Looxa',
    login: 'Gal',
    startLearning: 'Bilow Barashada',
    heroTagline: 'Mashruucii ugu horreeyay adduunka ee isticmaala nidaamka Saba\' ee Soomaalida si loo soo saaro arday xirfad leh',
    howToRegister: 'Sida loo isdiiwaangeliyo',
    learningLevels: 'Heerarka Barashada',
    aboutUs: 'Ku Saabsan Annaga',
    testimonials: 'Markhaatiyaasha Culimada',
    contact: 'Nala Soo Xiriir',
    beginner: 'Bilow (Tajwiid)',
    intermediate: 'Dhexdhexaad (Xifdi & Muraajaco)',
    advanced: 'Sare (Ijaazo)',
    step1: 'Dooro Kaalinta',
    step2: 'Buuxi Xogta',
    step3: 'Xaqiiji',
    step4: 'Bilow Barashada',
    footerDesc: 'Tarteel E-Maqraa - Mashruuc caalami ah oo casri ah oo lagu barto Quraanka kana dhisan Muqdisho, Soomaaliya.',
    admin: 'Maamule',
    teacher: 'Macalin',
    student: 'Arday',
    dashboardTitle: 'Looxa',
    liveClass: 'Fasalka Tooska',
    certificates: 'Shahaadooyinka',
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
