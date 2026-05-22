import { defineConfig } from "drizzle-kit";

// ملاحظة: Drizzle Kit سيقرأ DATABASE_URL من ملف .env تلقائياً
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is missing from environment variables.");
}

export default defineConfig({
  schema: "./src/schema/index.ts", 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
