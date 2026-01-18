# 天堂M 近戰戰力模組分析系統 - 部署指南

## 📋 部署前準備

### 1. Supabase 設定

#### 步驟 1：建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com/) 並登入
2. 點擊「New Project」建立新專案
3. 記錄您的專案 URL 和 anon key

#### 步驟 2：執行資料庫架構
1. 在 Supabase Dashboard 中，選擇「SQL Editor」
2. 複製 `database_schema.sql` 的內容
3. 執行 SQL 腳本建立資料表

#### 步驟 3：設定 RLS 政策（選用）
- 資料庫架構已包含基本的 RLS 政策
- 可依據需求調整存取權限

### 2. 本地測試

```bash
# 安裝依賴
npm install

# 設定 config.js
# 將 YOUR_SUPABASE_URL 和 YOUR_SUPABASE_ANON_KEY 替換為實際值

# 啟動開發伺服器
npm run dev

# 在瀏覽器訪問 http://localhost:5173
```

## 🚀 部署至 Vercel

### 方法一：透過 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login

# 部署
vercel

# 設定環境變數
vercel env add VITE_SUPABASE_URL
# 輸入您的 Supabase URL

vercel env add VITE_SUPABASE_KEY
# 輸入您的 Supabase anon key

# 重新部署以套用環境變數
vercel --prod
```

### 方法二：透過 Vercel Dashboard

#### 步驟 1：推送至 GitHub
```bash
# 初始化 Git（如果尚未初始化）
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: 天堂M戰力分析系統"

# 推送至 GitHub
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

#### 步驟 2：在 Vercel 匯入專案
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊「Add New...」→「Project」
3. 選擇您的 GitHub repository
4. 點擊「Import」

#### 步驟 3：設定環境變數
在 Vercel 專案設定中：
1. 前往「Settings」→「Environment Variables」
2. 添加以下變數：
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: 您的 Supabase 專案 URL
   - **Environment**: 選擇 Production, Preview, Development
   
   - **Name**: `VITE_SUPABASE_KEY`
   - **Value**: 您的 Supabase anon key
   - **Environment**: 選擇 Production, Preview, Development

#### 步驟 4：部署
1. 點擊「Deploy」
2. 等待建置完成
3. 訪問您的部署 URL

## 🔧 部署設定檔說明

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_KEY": "@supabase-key"
  }
}
```

### package.json 建置腳本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## ✅ 部署後檢查清單

- [ ] 訪問主頁面 (index.html) 確認正常顯示
- [ ] 訪問管理員頁面 (admin.html) 確認正常顯示
- [ ] 測試數據輸入功能
- [ ] 測試數據儲存至 Supabase
- [ ] 測試管理員看板數據載入
- [ ] 檢查瀏覽器控制台無錯誤訊息
- [ ] 測試響應式設計（手機、平板、桌面）

## 🐛 常見問題排除

### 問題 1：無法連接到 Supabase
**解決方案**：
1. 檢查環境變數是否正確設定
2. 確認 Supabase 專案的 API 設定
3. 檢查瀏覽器控制台的錯誤訊息

### 問題 2：部署後出現 404 錯誤
**解決方案**：
1. 確認 `vercel.json` 路由設定正確
2. 檢查建置輸出目錄 (dist) 是否包含所有檔案

### 問題 3：環境變數未生效
**解決方案**：
1. 在 Vercel Dashboard 重新檢查環境變數
2. 確保變數名稱前綴為 `VITE_`
3. 重新部署專案

### 問題 4：資料無法儲存
**解決方案**：
1. 檢查 Supabase RLS 政策設定
2. 確認資料表結構正確
3. 檢查網路請求是否成功

## 📊 效能優化建議

### 1. 資料庫索引
- 已在 `database_schema.sql` 中建立必要索引
- 定期檢查查詢效能

### 2. 前端優化
- 使用 CDN 載入外部資源 (Tailwind, Chart.js)
- 實施資料快取策略
- 圖片優化（如需要）

### 3. Vercel 設定
- 啟用 Edge Functions（如需要）
- 設定適當的快取標頭

## 🔒 安全性建議

### 1. Supabase RLS
```sql
-- 建議設定更嚴格的 RLS 政策
-- 例如：只允許特定 IP 或已驗證用戶存取

-- 撤銷現有政策
DROP POLICY IF EXISTS "允許所有人刪除數據" ON alliance_combat_stats;

-- 建立更嚴格的刪除政策
CREATE POLICY "限制刪除權限" ON alliance_combat_stats
    FOR DELETE
    USING (auth.role() = 'admin');
```

### 2. 環境變數
- 絕不將敏感資訊提交至版本控制
- 使用 Vercel 環境變數管理
- 定期輪換 API 金鑰

### 3. CORS 設定
- 在 Supabase 設定允許的來源網域
- 限制 API 存取範圍

## 📈 監控與維護

### 1. Vercel Analytics
- 啟用 Vercel Analytics 追蹤流量
- 監控建置時間和部署狀態

### 2. Supabase Dashboard
- 定期檢查資料庫使用量
- 監控 API 請求數量
- 查看錯誤日誌

### 3. 定期備份
```bash
# 使用 Supabase CLI 備份資料庫
supabase db dump -f backup.sql
```

## 🔄 更新部署

### 透過 Git
```bash
# 修改程式碼後
git add .
git commit -m "Update: 功能描述"
git push origin main

# Vercel 會自動觸發部署
```

### 透過 Vercel CLI
```bash
# 本地測試
npm run build
npm run preview

# 部署
vercel --prod
```

## 📞 技術支援

如遇到部署問題：
1. 查看 Vercel 部署日誌
2. 檢查 Supabase 錯誤訊息
3. 參考官方文件：
   - [Vercel 文件](https://vercel.com/docs)
   - [Supabase 文件](https://supabase.com/docs)

---

**祝部署順利！** 🎉
