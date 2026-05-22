// القراءات العشر (Ten Qira'at) - للمعلمين والطلاب في مستوى الإجازة
export const TEN_QIRAAT = [
  { id: "nafi", nameAr: "نافع", nameEn: "Nafi'" },
  { id: "ibn_kathir", nameAr: "ابن كثير", nameEn: "Ibn Kathir" },
  { id: "abu_amr", nameAr: "أبو عمرو", nameEn: "Abu Amr" },
  { id: "ibn_amir", nameAr: "ابن عامر", nameEn: "Ibn Amir" },
  { id: "asim", nameAr: "عاصم", nameEn: "Asim" },
  { id: "hamzah", nameAr: "حمزة", nameEn: "Hamzah" },
  { id: "al_kisai", nameAr: "الكسائي", nameEn: "Al-Kisa'i" },
  { id: "abu_jafar", nameAr: "أبو جعفر", nameEn: "Abu Ja'far" },
  { id: "yaqub", nameAr: "يعقوب", nameEn: "Yaqub" },
  { id: "khalaf", nameAr: "خلف العاشر", nameEn: "Khalaf al-Aishir" },
] as const;

// نطاقات الأجزاء للمعلمين والطلاب المتوسطين
export const JUZ_RANGES = [
  { value: 5, label: "5 Juz", labelAr: "5 أجزاء" },
  { value: 10, label: "10 Juz", labelAr: "10 أجزاء" },
  { value: 15, label: "15 Juz", labelAr: "15 جزءاً" },
  { value: 20, label: "20 Juz", labelAr: "20 جزءاً" },
  { value: 25, label: "25 Juz", labelAr: "25 جزءاً" },
  {
    value: 30,
    label: "30 Juz (Full Quran)",
    labelAr: "30 جزءاً (القرآن كاملاً)",
  },
] as const;

// المتون الستة لمعلمي المتون (Meton Teachers)
export const METON_TEXTS = [
  {
    id: "tuhfatAlAtfal",
    nameAr: "تحفة الأطفال",
    nameEn: "Tuhfat al-Atfal",
    description: "Tajweed basics for children",
    icon: "📖",
  },
  {
    id: "jazariyyah",
    nameAr: "الجزرية",
    nameEn: "Jazariyyah",
    description: "Al-Muqaddimah al-Jazariyyah",
    icon: "📚",
  },
  {
    id: "shatibiyyah",
    nameAr: "الشاطبية",
    nameEn: "Shatibiyyah",
    description: "Hirz al-Amani wa Wajh al-Tahani",
    icon: "📜",
  },
  {
    id: "durrah",
    nameAr: "الدرة",
    nameEn: "Durrah",
    description: "Al-Durrah al-Mudiyyah",
    icon: "💎",
  },
  {
    id: "tayyibatAlNashr",
    nameAr: "طيبة النشر",
    nameEn: "Tayyibat al-Nashr",
    description: "Tayyibat al-Nashr fi al-Qira'at al-Ashr",
    icon: "🌟",
  },
  {
    id: "salsabil",
    nameAr: "السلسبيل",
    nameEn: "Salsabil",
    description: "Al-Salsabil al-Shafi",
    icon: "💧",
  },
] as const;

// أنواع المعلمين
export const TEACHER_TYPES = [
  {
    value: "beginner",
    labelEn: "Beginner Teacher",
    labelAr: "معلم مبتدئين",
    description: "General classroom for Tajweed/Skills",
    requiresSelection: false,
  },
  {
    value: "intermediate",
    labelEn: "Intermediate Teacher",
    labelAr: "معلم متوسط",
    description: "Must select Juz range",
    requiresSelection: true,
    selectionType: "juz",
  },
  {
    value: "meton",
    labelEn: "Meton Teacher",
    labelAr: "معلم متون",
    description: "General expert in all texts",
    requiresSelection: false,
  },
  {
    value: "ijaza",
    labelEn: "Ijaza Teacher",
    labelAr: "معلم إجازة",
    description: "Must select specialized Qira'at",
    requiresSelection: true,
    selectionType: "qiraat",
  },
] as const;

// أنواع المحاورين
export const INTERVIEWER_TYPES = [
  {
    value: "placement",
    labelEn: "Placement Interviewer",
    labelAr: "محاور تحديد المستوى",
    description: "The Brain - Manages 20 students for initial routing",
    maxQueue: 20,
    color: "#D4AF37", // Gold
  },
  {
    value: "hifz",
    labelEn: "Hifz Interviewer",
    labelAr: "محاور حفظ",
    description: "Expert in Juz progression and promotions",
    maxQueue: 10,
    color: "#800000", // Maroon
  },
  {
    value: "ijaza",
    labelEn: "Ijaza Interviewer",
    labelAr: "محاور إجازة",
    description: "General expert in all Ten Qira'at for final certification",
    maxQueue: 5,
    color: "#FFD700", // Bright Gold
  },
] as const;

export type QiraatId = (typeof TEN_QIRAAT)[number]["id"];
export type JuzRange = (typeof JUZ_RANGES)[number]["value"];
export type MetonTextId = (typeof METON_TEXTS)[number]["id"];
export type TeacherType = (typeof TEACHER_TYPES)[number]["value"];
export type InterviewerType = (typeof INTERVIEWER_TYPES)[number]["value"];
