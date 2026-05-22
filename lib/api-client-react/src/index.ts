// تصدير كافة الوظائف والأنواع المولدة من Orval تلقائياً
export * from "./generated/api";
export * from "./generated/api.schemas";

/**
 * تصدير الخطافات (Hooks) المتوفرة في ملف api.ts
 * تم إضافة useLogin و useRegisterAdmin لدعم العمليات الجديدة
 */
export { 
  useLogin,            // جديد: تسجيل الدخول
  useRegisterAdmin,    // جديد: تسجيل مدير
  useRegisterStudent, 
  useRegisterTeacher,
  useHealthCheck,
  useCreateSession
} from "./generated/api";

// تصدير إعدادات التخصيص من ملف custom-fetch
export { 
  setBaseUrl, 
  setAuthTokenGetter,
  customFetch 
} from "./custom-fetch";

export type { 
  AuthTokenGetter, 
  CustomFetchOptions, 
  ApiError 
} from "./custom-fetch";