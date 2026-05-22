"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar' | 'so';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    institute: 'Institute',
    register: 'Register',
    dashboard: 'Dashboard',
    login: 'Login',
    startLearning: 'Start Learning',
    
    // Hero & Landing
    heroTagline: "First Platform in the World Using the Somali Saba' System to Produce Skilled Students",
    howToRegister: 'How to Register',
    learningLevels: 'Learning Levels',
    aboutUs: 'About Us',
    testimonials: 'Scholars Testimonials',
    contact: 'Contact Us',
    footerDesc: 'Tarteel E-Maqraa - Advanced Global Quran Learning Platform based in Mogadishu, Somalia.',
    
    // Roles & Levels
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
    beginner: 'Beginner (Tajweed)',
    intermediate: 'Intermediate (Hifz & Review)',
    advanced: 'Advanced (Ijaza)',
    
    // Auth & Dashboard
    dashboardTitle: 'Control Panel',
    welcomeBack: 'Welcome back',
    liveClass: 'Live Class',
    certificates: 'Certificates',
    step1: 'Choose Role',
    step2: 'Fill Info',
    step3: 'Verify',
    step4: 'Start Learning',
    
    // Notifications & Promotions (Added)
    promotion_success: "Student promoted successfully",
    moved_to: "Now moved to level",
    cert_request_sent: "Certificate request sent to Admin",

    // Auth Errors
    "auth.errors.account_exists": "This account already exists for this role.",
    "auth.errors.no_account": "Account not found. Please register first.",
    "auth.errors.wrong_password": "Incorrect password. Please try again.",
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    institute: 'المعهد',
    register: 'تسجيل',
    dashboard: 'لوحة القيادة',
    login: 'دخول',
    startLearning: 'ابدأ التعلم',
    
    // Hero & Landing
    heroTagline: 'المنصة الأولى في العالم التي تستخدم نظام السبع الصومالي لتخريج طلاب متقنين',
    howToRegister: 'كيفية التسجيل',
    learningLevels: 'مستويات التعلم',
    aboutUs: 'معلومات عنا',
    testimonials: 'شهادات العلماء',
    contact: 'اتصل بنا',
    footerDesc: 'ترتيل المقرأة - منصة عالمية متقدمة لتعلم القرآن مقرها مقديشو، الصومال.',
    
    // Roles & Levels
    admin: 'مدير',
    teacher: 'معلم',
    student: 'طالب',
    beginner: 'مبتدئ (تجويد)',
    intermediate: 'متوسط (حفظ ومراجعة)',
    advanced: 'متقدم (إجازة)',
    
    // Auth & Dashboard
    dashboardTitle: 'لوحة التحكم',
    welcomeBack: 'مرحباً بعودتك',
    liveClass: 'الفصل المباشر',
    certificates: 'الشهادات',
    step1: 'اختر الدور',
    step2: 'املأ البيانات',
    step3: 'تحقق',
    step4: 'ابدأ التعلم',

    // Notifications & Promotions (Added)
    promotion_success: "تمت ترقية الطالب بنجاح",
    moved_to: "انتقل الآن إلى مستوى",
    cert_request_sent: "تم إرسال طلب الشهادة للمدير",
    
    // Auth Errors
    "auth.errors.account_exists": "هذا الحساب موجود بالفعل لهذا الدور.",
    "auth.errors.no_account": "الحساب غير موجود. يرجى التسجيل أولاً.",
    "auth.errors.wrong_password": "كلمة المرور غير صحيحة. حاول مرة أخرى.",
  },
  so: {
    // Navigation
    home: 'Bogga Hore',
    institute: 'Machadka',
    register: 'Isdiiwaangeli',
    dashboard: 'Looxa',
    login: 'Gal',
    startLearning: 'Bilow Barashada',
    
    // Hero & Landing
    heroTagline: "Mashruucii ugu horreeyay adduunka ee isticmaala nidaamka Saba' ee Soomaalida si loo soo saaro arday xirfad leh",
    howToRegister: 'Sida loo isdiiwaangeliyo',
    learningLevels: 'Heerarka Barashada',
    aboutUs: 'Ku Saabsan Annaga',
    testimonials: 'Markhaatiyaasha Culimada',
    contact: 'Nala Soo Xiriir',
    footerDesc: 'Tarteel E-Maqraa - Mashruuc caalami ah oo casri ah oo lagu barto Quraanka kana dhisan Muqdisho, Soomaaliya.',
    
    // Roles & Levels
    admin: 'Maamule',
    teacher: 'Macalin',
    student: 'Arday',
    beginner: 'Bilow (Tajwiid)',
    intermediate: 'Dhexdhexaad (Xifdi & Muraajaco)',
    advanced: 'Sare (Ijaazo)',
    
    // Auth & Dashboard
    dashboardTitle: 'Looxa Maamulka',
    welcomeBack: 'Ku soo dhawaaw mar kale',
    liveClass: 'Fasalka Tooska',
    certificates: 'Shahaadooyinka',
    step1: 'Dooro Kaalinta',
    step2: 'Buuxi Xogta',
    step3: 'Xaqiiji',
    step4: 'Bilow Barashada',

    // Notifications & Promotions (Added)
    promotion_success: "Ardayga si guul leh ayaa loo dallacsiiyay",
    moved_to: "Wuxuu u gudbay heerka",
    cert_request_sent: "Codsiga shahaadada waxaa loo diray maamulaha",
    
    // Auth Errors
    "auth.errors.account_exists": "Koontadan horay ayey u jirtay.",
    "auth.errors.no_account": "Koontada lama helin. Fadlan marka hore isdiiwaangeli.",
    "auth.errors.wrong_password": "Erayga sirta ah waa qalad. Fadlan mar kale isku day.",
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
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir}>
        {children}
      </div>
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