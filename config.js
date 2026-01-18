// Supabase 配置文件
// 部署到 Vercel 時會自動讀取環境變數

const SUPABASE_CONFIG = {
    // Supabase 專案 URL
    // 本地開發：直接填入
    // Vercel 部署：會從環境變數讀取
    url: 'https://rndewddjxadyrjsygapu.supabase.co',
    
    // Supabase anon key
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGV3ZGRqeGFkeXJqc3lnYXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MDQwMjIsImV4cCI6MjA4NDI4MDAyMn0.OUnd1NX-4Su7rjSZzWiJAR3wrMo15bSVUEBjG98_v0M'
};

// ============================================
// 設定說明：
// ============================================
// 
// 【方法一】本地開發
// 直接將上方的 'YOUR_SUPABASE_URL' 和 'YOUR_SUPABASE_ANON_KEY' 
// 替換成你的 Supabase 憑證
//
// 【方法二】Vercel 部署（推薦）
// 1. 在 Vercel 專案設定 > Environment Variables 新增：
//    - SUPABASE_URL = 你的 Supabase Project URL
//    - SUPABASE_KEY = 你的 Supabase anon public key
// 2. 使用 vercel.json 中的 env 設定讀取
//
// 【取得 Supabase 憑證】
// 1. 登入 https://supabase.com
// 2. 選擇你的專案
// 3. Settings > API
// 4. 複製 Project URL 和 anon public key
// ============================================

