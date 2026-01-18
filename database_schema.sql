-- 天堂M 近戰戰力模組分析系統 - 資料庫架構

-- 建立主要資料表
CREATE TABLE IF NOT EXISTS alliance_combat_stats (
    id BIGSERIAL PRIMARY KEY,
    member_name TEXT UNIQUE NOT NULL,
    role_type TEXT DEFAULT 'Melee',
    
    -- 9大模組數據（使用 JSONB 格式儲存）
    star_module JSONB DEFAULT '{}',
    pattern_module JSONB DEFAULT '{}',
    collection_module JSONB DEFAULT '{}',
    artifact_module JSONB DEFAULT '{}',
    doll_module JSONB DEFAULT '{}',
    transform_module JSONB DEFAULT '{}',
    proficiency_module JSONB DEFAULT '{}',
    elixir_module JSONB DEFAULT '{}',
    skill_status JSONB DEFAULT '{}',
    
    -- 總戰力分數
    total_score INTEGER DEFAULT 0,
    
    -- 時間戳記
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_member_name ON alliance_combat_stats(member_name);
CREATE INDEX IF NOT EXISTS idx_total_score ON alliance_combat_stats(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_role_type ON alliance_combat_stats(role_type);
CREATE INDEX IF NOT EXISTS idx_updated_at ON alliance_combat_stats(updated_at DESC);

-- 建立 GIN 索引用於 JSONB 欄位查詢
CREATE INDEX IF NOT EXISTS idx_star_module ON alliance_combat_stats USING GIN (star_module);
CREATE INDEX IF NOT EXISTS idx_skill_status ON alliance_combat_stats USING GIN (skill_status);

-- 建立自動更新 updated_at 的函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器
DROP TRIGGER IF EXISTS update_alliance_combat_stats_updated_at ON alliance_combat_stats;
CREATE TRIGGER update_alliance_combat_stats_updated_at
    BEFORE UPDATE ON alliance_combat_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 建立 RLS (Row Level Security) 政策（選用）
-- 啟用 RLS
ALTER TABLE alliance_combat_stats ENABLE ROW LEVEL SECURITY;

-- 允許所有人讀取
CREATE POLICY "允許所有人查看數據" ON alliance_combat_stats
    FOR SELECT
    USING (true);

-- 允許所有人插入
CREATE POLICY "允許所有人新增數據" ON alliance_combat_stats
    FOR INSERT
    WITH CHECK (true);

-- 允許所有人更新
CREATE POLICY "允許所有人更新數據" ON alliance_combat_stats
    FOR UPDATE
    USING (true);

-- 允許所有人刪除（可依需求調整）
CREATE POLICY "允許所有人刪除數據" ON alliance_combat_stats
    FOR DELETE
    USING (true);

-- 建立視圖：統計摘要
CREATE OR REPLACE VIEW alliance_stats_summary AS
SELECT
    COUNT(*) as total_members,
    ROUND(AVG(total_score)) as avg_score,
    MAX(total_score) as max_score,
    MIN(total_score) as min_score,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) as median_score
FROM alliance_combat_stats;

-- 建立視圖：模組統計
CREATE OR REPLACE VIEW module_statistics AS
SELECT
    'star_module' as module_name,
    jsonb_object_keys(star_module) as attribute,
    AVG((star_module->>jsonb_object_keys(star_module))::numeric) as avg_value,
    MAX((star_module->>jsonb_object_keys(star_module))::numeric) as max_value
FROM alliance_combat_stats
WHERE star_module IS NOT NULL AND jsonb_typeof(star_module) = 'object'
GROUP BY module_name, attribute;

-- 範例數據（測試用）
INSERT INTO alliance_combat_stats (member_name, role_type, total_score, star_module, skill_status)
VALUES 
    ('測試角色1', 'Melee', 150, 
     '{"近距離傷害": 100, "近距離命中": 80, "力量": 50}',
     '{"金技數量": 2, "金技是否全滿": 1, "金技等級總和": 20}'),
    ('測試角色2', 'Melee', 120,
     '{"近距離傷害": 85, "近距離命中": 70, "力量": 45}',
     '{"金技數量": 1, "金技是否全滿": 0, "金技等級總和": 15}')
ON CONFLICT (member_name) DO NOTHING;

-- 查詢所有成員及其戰力
-- SELECT member_name, role_type, total_score, updated_at 
-- FROM alliance_combat_stats 
-- ORDER BY total_score DESC;

-- 查詢統計摘要
-- SELECT * FROM alliance_stats_summary;

-- 查詢特定成員的詳細數據
-- SELECT * FROM alliance_combat_stats WHERE member_name = '測試角色1';

-- 更新成員數據範例
-- UPDATE alliance_combat_stats 
-- SET total_score = 200, 
--     star_module = '{"近距離傷害": 120, "近距離命中": 90}' 
-- WHERE member_name = '測試角色1';

-- 刪除測試數據
-- DELETE FROM alliance_combat_stats WHERE member_name LIKE '測試角色%';
