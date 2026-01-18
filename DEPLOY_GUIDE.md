# 🚀 亞丁戰盟戰力系統 - 部署指南

## 概述
本指南將協助您將系統部署到網路上，讓盟友可以透過網址存取並填寫數據。

---

## 📋 部署步驟總覽

1. 建立 Supabase 專案（免費）
2. 設定資料庫
3. 連接 GitHub
4. 部署到 Vercel（免費）
5. 設定環境變數
6. 測試與分享

---

## 步驟一：建立 Supabase 專案

### 1.1 註冊/登入 Supabase
1. 前往 https://supabase.com
2. 點擊「Start your project」
3. 使用 GitHub 帳號登入（推薦）或建立新帳號

### 1.2 建立新專案
1. 點擊「New Project」
2. 填寫：
   - **Name**: `aden-combat-system`（或任意名稱）
   - **Database Password**: 設定一個強密碼（請記住！）
   - **Region**: 選擇 `Northeast Asia (Tokyo)` 最近的地區
3. 點擊「Create new project」
4. 等待 2-3 分鐘讓專案建立完成

### 1.3 取得 API 憑證
1. 在左側選單點擊「Settings」→「API」
2. 記下以下兩個值：
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`（很長的字串）

---

## 步驟二：設定資料庫

### 2.1 執行資料庫腳本
1. 在 Supabase 左側選單點擊「SQL Editor」
2. 點擊「New query」
3. 複製 `supabase_setup.sql` 的全部內容貼上
4. 點擊「Run」執行

### 2.2 確認資料表已建立
1. 點擊左側「Table Editor」
2. 應該看到兩個表格：
   - `users` - 用戶資料
   - `combat_data` - 戰力數據

### 2.3 修改預設管理員密碼（重要！）
預設帳號：`admin@aden.com` / 密碼：`admin123`

建議登入後修改密碼，或在 SQL Editor 執行：
```sql
UPDATE users 
SET password_hash = '你的新密碼SHA256雜湊' 
WHERE email = 'admin@aden.com';
```

---

## 步驟三：連接 GitHub

### 3.1 建立 GitHub Repository
1. 前往 https://github.com
2. 點擊右上角「+」→「New repository」
3. 填寫：
   - **Repository name**: `aden-combat-system`
   - **Visibility**: Private（私人）或 Public（公開）
4. 點擊「Create repository」

### 3.2 上傳程式碼
在專案資料夾中執行以下命令：

```bash
# 初始化 Git
git init

# 加入所有檔案
git add .

# 提交
git commit -m "Initial commit"

# 連接遠端倉庫（替換成你的 GitHub 網址）
git remote add origin https://github.com/你的帳號/aden-combat-system.git

# 推送
git push -u origin main
```

---

## 步驟四：部署到 Vercel

### 4.1 註冊/登入 Vercel
1. 前往 https://vercel.com
2. 使用 GitHub 帳號登入

### 4.2 導入專案
1. 點擊「Add New...」→「Project」
2. 在「Import Git Repository」找到你的 `aden-combat-system`
3. 點擊「Import」

### 4.3 設定環境變數（重要！）
在部署設定頁面：
1. 展開「Environment Variables」
2. 新增兩個變數：

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxxx.supabase.co`（你的 Project URL） |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIs...`（你的 anon public key） |

### 4.4 部署
1. 點擊「Deploy」
2. 等待 1-2 分鐘
3. 部署成功後會顯示網址，例如：`https://aden-combat-system.vercel.app`

---

## 步驟五：設定 config.js

部署後，編輯 `config.js` 填入你的 Supabase 憑證：

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxx.supabase.co',  // 替換成你的 Project URL
    key: 'eyJhbGciOiJIUzI1NiIs...'       // 替換成你的 anon public key
};
```

然後重新推送到 GitHub，Vercel 會自動重新部署。

---

## 步驟六：測試系統

### 6.1 測試註冊
1. 開啟你的網站網址
2. 點擊「登入」→「註冊」
3. 填寫測試帳號資料
4. 確認可以成功註冊

### 6.2 測試登入
1. 使用剛註冊的帳號登入
2. 或使用管理員帳號：`admin@aden.com` / `admin123`

### 6.3 測試數據儲存
1. 登入後填寫一些測試數據
2. 點擊「存檔」
3. 重新整理頁面確認數據保留

---

## 📱 分享給盟友

部署成功後，將網址分享給盟友：
```
https://你的專案名稱.vercel.app
```

盟友需要：
1. 開啟網址
2. 點擊「註冊」建立帳號
3. 登入後即可填寫自己的戰力數據

---

## 🔧 管理員功能

以管理員帳號登入後可以：

1. **成員分析**：查看所有成員的戰力數據和排名
2. **使用者管理**：
   - 查看所有註冊用戶
   - 修改用戶權限（admin/member/viewer）
   - 停用/啟用用戶帳號

---

## ❓ 常見問題

### Q: 部署後登入失敗？
A: 確認 `config.js` 中的 Supabase 憑證是否正確填寫。

### Q: 註冊時顯示「離線模式」？
A: Supabase 連線失敗，檢查：
- config.js 的 URL 和 KEY 是否正確
- Supabase 專案是否正常運作

### Q: 如何修改預設管理員密碼？
A: 在 Supabase SQL Editor 執行：
```sql
UPDATE users SET password_hash = 'SHA256雜湊值' WHERE email = 'admin@aden.com';
```

### Q: 可以自訂網址嗎？
A: 可以！在 Vercel 設定中：
1. Settings → Domains
2. 可以設定自訂域名或修改 Vercel 子網域

---

## 📞 技術支援

如有問題，請檢查：
1. 瀏覽器 Console（F12）的錯誤訊息
2. Supabase Dashboard 的 Logs
3. Vercel 的 Deployment Logs

---

祝部署順利！🎉
