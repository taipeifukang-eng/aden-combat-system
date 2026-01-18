-- ============================================
-- 亞丁戰盟戰力系統 - Supabase 資料庫設定
-- 請在 Supabase SQL Editor 中執行此腳本
-- ============================================

-- ========== 1. 用戶資料表 ==========
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    game_character_id TEXT NOT NULL,  -- 遊戲角色ID
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_game_character ON users(game_character_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ========== 2. 角色戰力數據表 ==========
CREATE TABLE IF NOT EXISTS combat_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    member_class TEXT,  -- 職業
    character_type TEXT DEFAULT 'melee' CHECK (character_type IN ('melee', 'mage', 'ranged')),
    
    -- 8大模組數據（JSONB格式）
    star JSONB DEFAULT '{}',
    pattern JSONB DEFAULT '{}',
    item JSONB DEFAULT '{}',
    artifact JSONB DEFAULT '{}',
    doll JSONB DEFAULT '{}',
    transform JSONB DEFAULT '{}',
    prof JSONB DEFAULT '{}',
    elixir JSONB DEFAULT '{}',
    skill JSONB DEFAULT '{}',
    
    -- 裝備數據
    equipment JSONB DEFAULT '{}',
    
    -- 戰力分數
    combat_power JSONB DEFAULT '{}',  -- {total, survival, burst, penetration, pvp}
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, member_name)
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_combat_data_user ON combat_data(user_id);
CREATE INDEX IF NOT EXISTS idx_combat_data_member ON combat_data(member_name);
CREATE INDEX IF NOT EXISTS idx_combat_data_type ON combat_data(character_type);
CREATE INDEX IF NOT EXISTS idx_combat_data_updated ON combat_data(updated_at DESC);

-- ========== 3. 自動更新 updated_at ==========
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_combat_data_updated_at ON combat_data;
CREATE TRIGGER update_combat_data_updated_at
    BEFORE UPDATE ON combat_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========== 4. Row Level Security (RLS) ==========

-- 啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_data ENABLE ROW LEVEL SECURITY;

-- 用戶表政策
-- 允許查看所有用戶（用於管理員）
CREATE POLICY "允許查看用戶" ON users FOR SELECT USING (true);

-- 允許新增用戶（註冊）
CREATE POLICY "允許註冊" ON users FOR INSERT WITH CHECK (true);

-- 允許更新自己的資料
CREATE POLICY "允許更新自己" ON users FOR UPDATE USING (true);

-- 戰力數據表政策
-- 允許所有人查看數據
CREATE POLICY "允許查看戰力數據" ON combat_data FOR SELECT USING (true);

-- 允許新增數據
CREATE POLICY "允許新增戰力數據" ON combat_data FOR INSERT WITH CHECK (true);

-- 允許更新數據
CREATE POLICY "允許更新戰力數據" ON combat_data FOR UPDATE USING (true);

-- 允許刪除數據
CREATE POLICY "允許刪除戰力數據" ON combat_data FOR DELETE USING (true);

-- ========== 5. 建立預設管理員帳號 ==========
-- 注意：請修改密碼！這裡使用 SHA256 雜湊
-- 預設帳號: admin@aden.com
-- 預設密碼: admin123 (請務必修改)

INSERT INTO users (email, password_hash, game_character_id, role)
VALUES (
    'admin@aden.com',
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', -- 'admin123' 的 SHA256
    '管理員',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- ========== 6. 實用視圖 ==========

-- 用戶列表視圖（隱藏密碼）
CREATE OR REPLACE VIEW users_view AS
SELECT 
    id, 
    email, 
    game_character_id, 
    role, 
    is_active, 
    created_at, 
    last_login
FROM users;

-- 戰力排行榜視圖
CREATE OR REPLACE VIEW combat_leaderboard AS
SELECT 
    cd.member_name,
    cd.member_class,
    cd.character_type,
    (cd.combat_power->>'total')::INTEGER as total_power,
    (cd.combat_power->>'survival')::INTEGER as survival,
    (cd.combat_power->>'burst')::INTEGER as burst,
    (cd.combat_power->>'penetration')::INTEGER as penetration,
    (cd.combat_power->>'pvp')::INTEGER as pvp,
    u.game_character_id,
    cd.updated_at
FROM combat_data cd
LEFT JOIN users u ON cd.user_id = u.id
ORDER BY (cd.combat_power->>'total')::INTEGER DESC NULLS LAST;

-- ========== 完成 ==========
-- 執行後請到 Supabase Dashboard:
-- 1. 複製 Project URL (Settings > API > Project URL)
-- 2. 複製 anon public key (Settings > API > anon public)
-- 3. 將這兩個值填入 config.js
