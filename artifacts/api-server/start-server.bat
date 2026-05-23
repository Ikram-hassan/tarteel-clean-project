@echo off
cd /d C:\Users\hp\Downloads\Tarteel-E-maqraa\artifacts\api-server
set DATABASE_URL=postgres://neondb_owner:npg_HJ9sdmoNGv1U@ep-lively-paper-altn8p61-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
set PORT=3000
set JWT_SECRET=tarteel_emaqraa_super_secret_key_2026_change_in_production
set LIVEKIT_URL=wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud
set LIVEKIT_API_KEY=APIWcGGRGSepZPC
set LIVEKIT_API_SECRET=EfAqsp4CjHRETdeoj9WZrXEGsBWCaApDcg4Dfx3VwIYB
node --enable-source-maps dist\index.mjs
