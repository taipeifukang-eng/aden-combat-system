# 天堂M 近戰戰力模組分析系統

一個用於天堂M遊戲的近戰角色戰力數據分析系統，提供數據輸入、戰力計算與管理員看板功能。

## 功能特色

### 🎮 數據輸入介面
- 9大核心模組數據收集
- 即時戰力計算
- 本地與雲端數據同步

### 📊 管理員看板
- 全盟數據統計
- 動態標竿系統（最大值基準）
- 個人 vs 全盟比較
- 多維度排行榜
- 數據視覺化圖表

### 🎯 9大核心模組

1. **守護星** (⭐) - 25項屬性指標
2. **紋樣** (🎨) - 16項屬性指標
3. **收藏** (📚) - 18項屬性指標
4. **聖物** (💎) - 金卡/青卡系統
5. **娃娃** (🎎) - 金卡/青卡系統
6. **變身** (🦅) - 金卡/青卡系統
7. **熟練度** (⚔️) - 三大熟練度
8. **仙丹** (💊) - 五大屬性仙丹
9. **技能** (✨) - 金/紫/紅技能系統

## 戰力計算規則

### 卡片系統
- 金卡：每張 10 分
- 青卡：每張 5 分

### 技能系統
- 金技數量：1個10分，2個15分
- 紫技滿技：5分
- 紅技滿技：5分
- 金技等級：每級2分
- 紫技等級：每級2分
- 紅技等級：每級1分

## 技術棧

- **前端**：HTML5, JavaScript (ES6+), Tailwind CSS
- **圖表**：Chart.js
- **資料庫**：Supabase
- **部署**：Vercel

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Supabase

在 Supabase 建立資料表：

```sql
CREATE TABLE alliance_combat_stats (
    id BIGSERIAL PRIMARY KEY,
    member_name TEXT UNIQUE NOT NULL,
    role_type TEXT DEFAULT 'Melee',
    star_module JSONB,
    pattern_module JSONB,
    collection_module JSONB,
    artifact_module JSONB,
    doll_module JSONB,
    transform_module JSONB,
    proficiency_module JSONB,
    elixir_module JSONB,
    skill_status JSONB,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_member_name ON alliance_combat_stats(member_name);
CREATE INDEX idx_total_score ON alliance_combat_stats(total_score DESC);
```

### 3. 配置環境變數

在 `config.js` 中設定您的 Supabase 憑證：

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_ANON_KEY'
};
```

或在部署到 Vercel 時設定環境變數：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

### 4. 本地開發

```bash
npm run dev
```

訪問 `http://localhost:5173`

### 5. 建置部署

```bash
npm run build
```

## 部署至 Vercel

### 方法一：使用 Vercel CLI

```bash
npm install -g vercel
vercel
```

### 方法二：透過 GitHub

1. 將專案推送至 GitHub
2. 在 Vercel 導入 GitHub 專案
3. 設定環境變數：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
4. 部署

## 使用說明

### 數據輸入頁面 (index.html)

1. 輸入角色名稱
2. 選擇左側模組導覽
3. 填寫各模組數據
4. 系統自動計算戰力
5. 點擊「儲存數據」同步至雲端

### 管理員看板 (admin.html)

1. 自動載入全盟數據
2. 查看統計摘要
3. 選擇成員進行分析
4. 檢視動態標竿與比較結果
5. 瀏覽多維度排行榜

## 專案結構

```
戰力等級計算器/
├── index.html          # 主頁面（數據輸入）
├── admin.html          # 管理員看板
├── app.js             # 主程式邏輯
├── admin.js           # 管理員看板邏輯
├── config.js          # Supabase 配置
├── package.json       # 專案配置
├── vite.config.js     # Vite 配置
└── README.md          # 說明文件
```

## 資料庫結構

### alliance_combat_stats 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| member_name | TEXT | 角色名稱（唯一） |
| role_type | TEXT | 職業類型 |
| star_module | JSONB | 守護星數據 |
| pattern_module | JSONB | 紋樣數據 |
| collection_module | JSONB | 收藏數據 |
| artifact_module | JSONB | 聖物數據 |
| doll_module | JSONB | 娃娃數據 |
| transform_module | JSONB | 變身數據 |
| proficiency_module | JSONB | 熟練度數據 |
| elixir_module | JSONB | 仙丹數據 |
| skill_status | JSONB | 技能數據 |
| total_score | INTEGER | 總戰力分數 |
| created_at | TIMESTAMPTZ | 建立時間 |
| updated_at | TIMESTAMPTZ | 更新時間 |

## 功能截圖

### 主頁面
- 左側導覽列顯示9大模組
- 右側表單輸入區域
- 即時戰力顯示

### 管理員看板
- 統計卡片顯示總成員數、平均戰力等
- 動態標竿顯示各項最大值
- 個人比較區域（低於平均20%紅色警示）
- 三大排行榜（總戰力、近距離傷害、近距離命中）
- 視覺化圖表

## 注意事項

1. **資料安全**：不要將 Supabase 憑證提交至公開的版本控制
2. **權限設定**：在 Supabase 設定適當的 RLS（Row Level Security）政策
3. **瀏覽器兼容**：建議使用現代瀏覽器（Chrome, Firefox, Edge）
4. **數據備份**：定期備份 Supabase 資料庫

## 常見問題

### Q: 無法連接到資料庫？
A: 請檢查 `config.js` 中的 Supabase 配置是否正確。

### Q: 數據沒有儲存？
A: 確認已輸入角色名稱，並檢查瀏覽器控制台是否有錯誤訊息。

### Q: 管理員看板無數據？
A: 確認至少有一筆數據已儲存至資料庫。

### Q: 如何修改戰力計算規則？
A: 編輯 `app.js` 中的 `calculateTotalScore()` 函數。

## 授權

本專案僅供學習與個人使用。

## 聯絡方式

如有問題或建議，請透過 GitHub Issues 回報。

---

**開發者**: 資深全端工程師
**版本**: 1.0.0
**最後更新**: 2026年1月
