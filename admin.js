// 管理員看板 - JavaScript

// 直接創建 Supabase 實例
const adminSupabase = window.supabase.createClient(
    'https://rndewddjxadyrjsygapu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGV3ZGRqeGFkeXJqc3lnYXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MDQwMjIsImV4cCI6MjA4NDI4MDAyMn0.OUnd1NX-4Su7rjSZzWiJAR3wrMo15bSVUEBjG98_v0M'
);

let selectedMembers = [];

// ===== 戰力計算權重系統（與 app.js 同步） =====

// A. 生存力 (Survival)
const ADMIN_SURVIVAL_WEIGHTS = {
    '最大HP': 0.2,
    '物理防禦力': 1.5,
    '傷害減免': 3.0,
    'PVP傷害減免': 3.0,
    '爆擊傷害減免': 3.0,
    '屬性傷害減免': 2.0,
    '昏迷狀態傷害減免': 2.0,
    '連續傷害減免': 2.0,
    '疊加傷害減免': 2.0,
    '傷害減少': 2.0,
    '減少近距離傷害': 2.0,
    'PVP傷害減少': 2.0,
    '持續傷害減少': 1.5,
    '破壞盔甲傷害減少': 2.0,
    'HP30%以下傷害量減少': 2.0,
    '近距離迴避力': 2.0,
    'PVP近距離迴避力': 2.0,
    '近距離爆擊抗性': 1.5,
    '阻擋武器': 1.5,
    '昏迷抗性': 1.0,
    '藥水恢復量': 0.5,
    '藥水恢復率': 0.5,
    '藥水冷卻時間減少': 1.0
};

// B. 輸出爆發 (Burst)
const ADMIN_BURST_WEIGHTS = {
    '力量': 2.0,
    '敏捷': 1.0,
    '力量增加%數': 3.0,
    '近距離傷害': 5.0,
    '傷害增加': 4.0,
    '機率附加傷害': 3.0,
    '近距離爆擊': 3.0,
    '爆擊時追加近距離傷害': 3.5,
    '決勝一擊': 3.0,
    '決勝一擊增幅率': 3.0,
    '攻擊速度': 10.0,
    '移動速度': 1.0
};

// C. 輸出效率 (Penetration)
const ADMIN_PENETRATION_WEIGHTS = {
    '近距離命中': 3.0,
    '無視傷害減免': 6.0,
    '無視PVP傷害減免': 6.0,
    '無視近距離傷害減免': 6.0,
    '無視近距離迴避力': 4.0,
    'PVP無視近距離迴避力': 4.0,
    '無視傷害減少': 4.0,
    'PVP傷害減少無視': 4.0,
    '無視近距離傷害減少': 4.0,
    '昏迷命中': 3.0
};

// D. PVP優勢
const ADMIN_PVP_WEIGHTS = {
    'PVP近距離附加傷害': 3.0,
    'PVP附加傷害': 3.0
};

// 計算成員各屬性統計（admin版本）
function calculateAdminMemberStats(member) {
    const stats = {};
    const allStats = [
        '力量', '敏捷', '力量增加%數', '近距離傷害', '近距離命中', '近距離爆擊',
        '機率附加傷害', '攻擊速度', '移動速度', '傷害增加', '決勝一擊', '決勝一擊增幅率',
        'PVP近距離附加傷害', 'PVP附加傷害', '爆擊時追加近距離傷害',
        '無視傷害減免', '無視PVP傷害減免', '無視近距離傷害減免',
        '無視近距離迴避力', 'PVP無視近距離迴避力', '無視傷害減少', 'PVP傷害減少無視', '無視近距離傷害減少',
        '物理防禦力', '最大HP', '傷害減免', 'PVP傷害減免', '爆擊傷害減免', '屬性傷害減免',
        '昏迷狀態傷害減免', '連續傷害減免', '疊加傷害減免',
        '傷害減少', '減少近距離傷害', 'PVP傷害減少', '持續傷害減少',
        '破壞盔甲傷害減少', 'HP30%以下傷害量減少',
        '近距離迴避力', 'PVP近距離迴避力', '近距離爆擊抗性', '阻擋武器', '昏迷命中', '昏迷抗性',
        '藥水恢復量', '藥水恢復率', '藥水冷卻時間減少'
    ];
    
    allStats.forEach(stat => {
        stats[stat] = { total: 0, sources: [] };
    });
    
    const moduleKeys = ['star', 'pattern', 'item', 'artifact', 'doll', 'transform', 'prof', 'elixir'];
    const moduleNames = {
        'star': '守護星',
        'pattern': '紋樣',
        'item': '道具收集',
        'artifact': '聖物',
        'doll': '魔法娃娃',
        'transform': '變身卡',
        'prof': '熟練度',
        'elixir': '哈芙萬能藥'
    };
    
    const equipmentKeys = [
        'eq_helmet', 'eq_tshirt', 'eq_badge', 'eq_shoulder', 'eq_weapon', 'eq_cloak',
        'eq_armor', 'eq_armguard', 'eq_boots', 'eq_gloves', 'eq_pants', 'eq_earring1',
        'eq_earring2', 'eq_belt', 'eq_necklace', 'eq_ring1', 'eq_ring2', 'eq_ring3',
        'eq_ring4', 'eq_bracelet1', 'eq_bracelet2', 'eq_bracelet3', 'eq_rune1', 'eq_rune2',
        'eq_guard_seal', 'eq_recover_seal', 'eq_crystal', 'eq_catalyst'
    ];
    
    const equipmentNames = {
        'eq_helmet': '頭盔',
        'eq_tshirt': '襯衫',
        'eq_badge': '徽章',
        'eq_shoulder': '肩甲',
        'eq_weapon': '武器',
        'eq_cloak': '斗篷',
        'eq_armor': '盔甲',
        'eq_armguard': '臂甲',
        'eq_boots': '靴子',
        'eq_gloves': '手套',
        'eq_pants': '褲子',
        'eq_earring1': '耳環1',
        'eq_earring2': '耳環2',
        'eq_belt': '腰帶',
        'eq_necklace': '項鍊',
        'eq_ring1': '戒指1',
        'eq_ring2': '戒指2',
        'eq_ring3': '戒指3',
        'eq_ring4': '戒指4',
        'eq_bracelet1': '手環1',
        'eq_bracelet2': '手環2',
        'eq_bracelet3': '手環3',
        'eq_rune1': '符石1',
        'eq_rune2': '符石2',
        'eq_guard_seal': '守護刻印',
        'eq_recover_seal': '恢復刻印',
        'eq_crystal': '結晶',
        'eq_catalyst': '觸媒'
    };
    
    // 遍歷所有模組
    moduleKeys.forEach(moduleKey => {
        if (member[moduleKey]) {
            Object.entries(member[moduleKey]).forEach(([field, value]) => {
                const numValue = parseFloat(value) || 0;
                if (numValue > 0 && stats[field]) {
                    stats[field].total += numValue;
                    stats[field].sources.push({
                        source: moduleNames[moduleKey],
                        value: numValue
                    });
                }
            });
        }
    });
    
    // 遍歷所有裝備
    if (member.equipment) {
        equipmentKeys.forEach(eqKey => {
            if (member.equipment[eqKey]) {
                Object.entries(member.equipment[eqKey]).forEach(([field, value]) => {
                    if (field === '裝備名稱') return;
                    const numValue = parseFloat(value) || 0;
                    if (numValue > 0 && stats[field]) {
                        const equipmentName = member.equipment[eqKey]['裝備名稱'];
                        stats[field].total += numValue;
                        stats[field].sources.push({
                            source: equipmentName ? `${equipmentNames[eqKey]}(${equipmentName})` : equipmentNames[eqKey],
                            value: numValue
                        });
                    }
                });
            }
        });
    }
    
    return stats;
}

// 計算四大維度戰力分數（admin版本）
function calculateAdminCombatPower(member) {
    const memberStats = calculateAdminMemberStats(member);
    const scores = {
        survival: 0,
        burst: 0,
        penetration: 0,
        pvp: 0,
        total: 0
    };
    
    Object.entries(ADMIN_SURVIVAL_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) scores.survival += memberStats[stat].total * weight;
    });
    
    Object.entries(ADMIN_BURST_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) scores.burst += memberStats[stat].total * weight;
    });
    
    Object.entries(ADMIN_PENETRATION_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) scores.penetration += memberStats[stat].total * weight;
    });
    
    Object.entries(ADMIN_PVP_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) scores.pvp += memberStats[stat].total * weight;
    });
    
    scores.total = Math.floor(scores.survival + scores.burst + scores.penetration + scores.pvp);
    scores.survival = Math.floor(scores.survival);
    scores.burst = Math.floor(scores.burst);
    scores.penetration = Math.floor(scores.penetration);
    scores.pvp = Math.floor(scores.pvp);
    
    return scores;
}

// 載入管理員數據
async function loadAdminData() {
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = '<p class="text-gray-500">載入中...</p>';
    
    // 從 Supabase 載入所有數據
    const { data: combatData, error } = await adminSupabase
        .from('combat_data')
        .select('*')
        .eq('character_type', 'melee')
        .order('updated_at', { ascending: false });
    
    if (error) {
        console.error('載入數據錯誤:', error);
        adminContent.innerHTML = `
            <div class="text-center text-red-500 py-8">
                <p>載入失敗：${error.message}</p>
            </div>
        `;
        return;
    }
    
    const allData = combatData || [];
    
    // 使用正確的權重公式重新計算戰力
    allData.forEach(data => {
        data.combatPower = calculateAdminCombatPower(data);
    });
    
    // 按總戰力排序
    allData.sort((a, b) => (b.combatPower?.total || 0) - (a.combatPower?.total || 0));
    
    if (allData.length === 0) {
        adminContent.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <span class="material-icons text-4xl mb-2">inbox</span>
                <p>尚無成員數據</p>
            </div>
        `;
        return;
    }
    
    // 顯示成員列表
    let html = `
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
                <span class="material-icons text-sm align-middle">info</span>
                勾選 2 個或以上的成員，然後點擊「開始比較」查看各模組數據對比
            </p>
        </div>
        
        <div class="mb-4">
            <button id="compareBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
                <span class="material-icons text-sm align-middle">compare_arrows</span>
                開始比較 (<span id="selectedCount">0</span>)
            </button>
            <button id="clearSelectionBtn" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg ml-2">
                清除選擇
            </button>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b bg-gray-50">
                        <th class="text-left py-3 px-4 w-12">
                            <input type="checkbox" id="selectAll" class="w-4 h-4">
                        </th>
                        <th class="text-left py-3 px-4">成員名稱</th>
                        <th class="text-center py-3 px-4">總戰力</th>
                        <th class="text-center py-3 px-4">🛡️生存</th>
                        <th class="text-center py-3 px-4">⚔️爆發</th>
                        <th class="text-center py-3 px-4">🎯穿透</th>
                        <th class="text-center py-3 px-4">👑PVP</th>
                        <th class="text-left py-3 px-4">更新時間</th>
                        <th class="text-left py-3 px-4">操作</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    allData.forEach((member, index) => {
        const updateTime = member.updated_at ? new Date(member.updated_at).toLocaleString() : '-';
        const memberJson = JSON.stringify(member).replace(/"/g, '&quot;');
        const cp = member.combatPower || { total: 0, survival: 0, burst: 0, penetration: 0, pvp: 0 };
        
        // 排名樣式
        let rankBadge = '';
        if (index === 0) rankBadge = '<span class="inline-block w-6 h-6 bg-yellow-500 text-white rounded-full text-center text-sm font-bold mr-2">1</span>';
        else if (index === 1) rankBadge = '<span class="inline-block w-6 h-6 bg-gray-400 text-white rounded-full text-center text-sm font-bold mr-2">2</span>';
        else if (index === 2) rankBadge = '<span class="inline-block w-6 h-6 bg-amber-600 text-white rounded-full text-center text-sm font-bold mr-2">3</span>';
        
        html += `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                    <input type="checkbox" class="member-checkbox w-4 h-4" 
                           value="${member.member_name}" 
                           data-member="${memberJson}">
                </td>
                <td class="py-3 px-4">
                    ${rankBadge}
                    <span class="font-semibold">${member.member_name || '未命名'}</span>
                    <span class="text-sm text-purple-600 ml-1">${member.member_class || ''}</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="font-bold text-lg text-purple-700">${cp.total.toLocaleString()}</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="text-red-600 font-semibold">${cp.survival.toLocaleString()}</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="text-orange-600 font-semibold">${cp.burst.toLocaleString()}</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="text-blue-600 font-semibold">${cp.penetration.toLocaleString()}</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="text-purple-600 font-semibold">${cp.pvp.toLocaleString()}</span>
                </td>
                <td class="py-3 px-4 text-gray-500 text-sm">${updateTime}</td>
                <td class="py-3 px-4">
                    <button onclick="viewMemberDetail('${member.member_name}')" 
                            class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                        查看詳情
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    
    html += '<div id="comparisonResult" class="mt-6"></div>';
    
    adminContent.innerHTML = html;
    
    // 綁定事件
    bindComparisonEvents();
}

// 綁定比較功能事件
function bindComparisonEvents() {
    const checkboxes = document.querySelectorAll('.member-checkbox');
    const selectAllCheckbox = document.getElementById('selectAll');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearSelectionBtn');
    const selectedCountSpan = document.getElementById('selectedCount');
    
    // 更新選擇狀態
    function updateSelection() {
        selectedMembers = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                try {
                    const dataAttr = cb.getAttribute('data-member');
                    // 將 HTML 實體轉回雙引號
                    const dataJson = dataAttr.replace(/&quot;/g, '"');
                    const memberData = JSON.parse(dataJson);
                    selectedMembers.push(memberData);
                    console.log('已選擇成員:', memberData.member_name, memberData);
                } catch (e) {
                    console.error('解析成員數據錯誤:', e, cb.getAttribute('data-member'));
                }
            }
        });
        
        console.log('總共選擇:', selectedMembers.length, '個成員');
        selectedCountSpan.textContent = selectedMembers.length;
        compareBtn.disabled = selectedMembers.length < 2;
        
        // 更新全選狀態
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
    
    // 個別勾選
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateSelection);
    });
    
    // 全選/全不選
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
            updateSelection();
        });
    }
    
    // 清除選擇
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
            updateSelection();
        });
    }
    
    // 開始比較
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            if (selectedMembers.length >= 2) {
                showComparison(selectedMembers);
            }
        });
    }
}

// 生成四大維度比較
function generateDimensionComparison(members) {
    // 計算每個成員的屬性統計
    const membersStats = members.map(m => calculateAdminMemberStats(m));
    
    // 計算每個成員的四大維度戰力
    const membersPower = members.map((m, idx) => ({
        name: m.member_name,
        stats: membersStats[idx],
        power: {
            survival: calculateDimensionPower(membersStats[idx], ADMIN_SURVIVAL_WEIGHTS),
            burst: calculateDimensionPower(membersStats[idx], ADMIN_BURST_WEIGHTS),
            penetration: calculateDimensionPower(membersStats[idx], ADMIN_PENETRATION_WEIGHTS),
            pvp: calculateDimensionPower(membersStats[idx], ADMIN_PVP_WEIGHTS)
        }
    }));
    
    // 將數據保存到全局變量供 onclick 使用
    window.currentComparisonData = membersPower.map(mp => ({
        name: mp.name,
        stats: mp.stats
    }));
    
    const dimensions = [
        { key: 'survival', name: '生存力', icon: '🛡️', color: 'red', weights: ADMIN_SURVIVAL_WEIGHTS },
        { key: 'burst', name: '爆發力', icon: '⚔️', color: 'orange', weights: ADMIN_BURST_WEIGHTS },
        { key: 'penetration', name: '穿透力', icon: '🎯', color: 'blue', weights: ADMIN_PENETRATION_WEIGHTS },
        { key: 'pvp', name: 'PVP優勢', icon: '👑', color: 'purple', weights: ADMIN_PVP_WEIGHTS }
    ];
    
    let html = '<div class="grid grid-cols-2 gap-4">';
    
    dimensions.forEach(dim => {
        const values = membersPower.map(mp => mp.power[dim.key]);
        const maxValue = Math.max(...values);
        
        html += `
            <div class="bg-white rounded-lg border border-${dim.color}-200 overflow-hidden">
                <div class="bg-${dim.color}-100 px-4 py-2 cursor-pointer hover:bg-${dim.color}-200 transition"
                     onclick="window.toggleDimension('${dim.key}')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="text-2xl mr-2">${dim.icon}</span>
                            <span class="font-bold text-${dim.color}-700">${dim.name}</span>
                        </div>
                        <span class="material-icons text-${dim.color}-600" id="dim-toggle-${dim.key}">expand_more</span>
                    </div>
                </div>
                <div id="dim-content-${dim.key}" class="p-4" style="display: none;">
                    <div class="space-y-3">
                        ${membersPower.map((mp, idx) => {
                            const value = values[idx];
                            const isMax = value === maxValue;
                            const percentage = maxValue > 0 ? (value / maxValue * 100) : 0;
                            return `
                                <div>
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-sm font-semibold ${isMax ? 'text-' + dim.color + '-700' : 'text-gray-700'}">${mp.name}</span>
                                        <span class="text-sm font-bold ${isMax ? 'text-' + dim.color + '-700' : 'text-gray-600'}">${value.toLocaleString()}</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="bg-${dim.color}-500 h-2 rounded-full ${isMax ? 'bg-' + dim.color + '-600' : ''}" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button onclick="window.showDimensionDetails('${dim.key}')" 
                            class="mt-4 w-full bg-${dim.color}-500 hover:bg-${dim.color}-600 text-white py-2 rounded-lg text-sm font-semibold">
                        查看詳細屬性比較
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// 計算單一維度戰力
function calculateDimensionPower(memberStats, weights) {
    let power = 0;
    Object.entries(weights).forEach(([stat, weight]) => {
        if (memberStats[stat]) {
            power += memberStats[stat].total * weight;
        }
    });
    return Math.floor(power);
}

// 顯示比較結果
function showComparison(members) {
    console.log('開始比較，成員數量:', members.length);
    console.log('成員數據:', JSON.stringify(members, null, 2));
    
    // 檢查每個成員的模組數據
    members.forEach(m => {
        console.log(`成員 ${m.member_name} 的模組:`, {
            star: m.star ? Object.keys(m.star).length : 0,
            pattern: m.pattern ? Object.keys(m.pattern).length : 0,
            item: m.item ? Object.keys(m.item).length : 0,
            artifact: m.artifact ? Object.keys(m.artifact).length : 0,
            doll: m.doll ? Object.keys(m.doll).length : 0,
            transform: m.transform ? Object.keys(m.transform).length : 0,
            prof: m.prof ? Object.keys(m.prof).length : 0,
            elixir: m.elixir ? Object.keys(m.elixir).length : 0
        });
    });
    
    const container = document.getElementById('comparisonResult');
    if (!container) return;
    
    const moduleNames = {
        star: '守護星',
        pattern: '紋樣',
        item: '道具收藏',
        artifact: '聖物卡',
        doll: '魔法娃娃',
        transform: '變身卡',
        prof: '熟練度',
        elixir: '哈芙萬能藥'
    };
    
    // 裝備名稱對照
    const equipmentNames = {
        eq_helmet: '頭盔',
        eq_tshirt: 'T恤',
        eq_badge: '徽章',
        eq_shoulder: '肩甲',
        eq_weapon: '武器',
        eq_cloak: '斗篷',
        eq_armor: '盔甲',
        eq_armguard: '臂甲',
        eq_boots: '靴子',
        eq_gloves: '手套',
        eq_pants: '褲子',
        eq_earring1: '耳環1',
        eq_earring2: '耳環2',
        eq_belt: '腰帶',
        eq_necklace: '項鍊',
        eq_ring1: '戒指1',
        eq_ring2: '戒指2',
        eq_ring3: '戒指3',
        eq_ring4: '戒指4',
        eq_bracelet1: '手環1',
        eq_bracelet2: '手環2',
        eq_bracelet3: '手環3',
        eq_rune1: '符石1',
        eq_rune2: '符石2',
        eq_guard_seal: '守護印章',
        eq_recover_seal: '恢復印章',
        eq_crystal: '水晶',
        eq_catalyst: '催化石'
    };
    
    let html = `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">
                    <span class="material-icons align-middle text-purple-600">analytics</span>
                    多角色模組比較
                </h3>
                <button onclick="document.getElementById('comparisonResult').innerHTML=''" 
                        class="text-gray-500 hover:text-gray-700">
                    <span class="material-icons">close</span>
                </button>
            </div>
            
            <div class="mb-4 flex items-center space-x-2 flex-wrap">
                <span class="text-sm font-semibold text-gray-600">比較對象：</span>
                ${members.map(m => `<span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">${m.member_name}</span>`).join('')}
            </div>
            
            <div class="mb-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                <span class="text-sm text-gray-600">
                    <span class="material-icons text-sm align-middle">info</span>
                    點擊模組標題展開/折疊查看完整數據
                </span>
                <div class="space-x-2">
                    <button onclick="window.expandAllModules()" class="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                        全部展開
                    </button>
                    <button onclick="window.collapseAllModules()" class="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                        全部折疊
                    </button>
                </div>
            </div>
            
            <!-- 四大維度戰力比較 -->
            <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span class="material-icons text-purple-600 mr-2">assessment</span>
                    四大維度戰力比較
                </h4>
                ${generateDimensionComparison(members)}
            </div>
            
            <div class="space-y-6">
    `;
    
    // 為每個模組創建比較表格
    Object.keys(moduleNames).forEach(moduleKey => {
        const moduleName = moduleNames[moduleKey];
        
        // 收集該模組的所有欄位名稱
        const allFields = new Set();
        members.forEach(member => {
            if (member[moduleKey]) {
                Object.keys(member[moduleKey]).forEach(field => allFields.add(field));
            }
        });
        
        console.log(`模組 ${moduleName} (${moduleKey}):`, allFields.size, '個欄位');
        
        if (allFields.size === 0) {
            console.log(`模組 ${moduleName} 無數據，跳過`);
            return;
        }
        
        html += `
            <div class="border rounded-lg overflow-hidden">
                <div class="bg-purple-600 text-white px-4 py-2 font-bold flex items-center justify-between cursor-pointer hover:bg-purple-700 transition"
                     onclick="window.toggleCompareModule('${moduleKey}')">
                    <span>${moduleName} (${allFields.size}項)</span>
                    <span class="material-icons module-toggle" id="compare-toggle-${moduleKey}">expand_more</span>
                </div>
                <div id="compare-module-${moduleKey}" class="overflow-x-auto" style="display: none;">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-2 px-3 border-r font-semibold sticky left-0 bg-gray-50">屬性</th>
                                ${members.map(m => `<th class="text-center py-2 px-3 font-semibold">${m.member_name}</th>`).join('')}
                                <th class="text-center py-2 px-3 bg-yellow-50 font-semibold">最高值</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // 顯示所有欄位
        const fieldsArray = Array.from(allFields);
        
        fieldsArray.forEach((field, idx) => {
            const values = members.map(member => {
                return member[moduleKey] && member[moduleKey][field] ? parseFloat(member[moduleKey][field]) : 0;
            });
            
            const maxValue = Math.max(...values);
            
            html += `
                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50">
                    <td class="py-2 px-3 border-r font-medium sticky left-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">${field}</td>
                    ${values.map(v => {
                        const isMax = v === maxValue && maxValue > 0;
                        return `<td class="text-center py-2 px-3 ${isMax ? 'bg-green-100 font-bold text-green-700' : ''}">${v}</td>`;
                    }).join('')}
                    <td class="text-center py-2 px-3 bg-yellow-50 font-bold text-yellow-700">${maxValue}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    // 裝備分隔標題
    html += `
        <div class="mt-8 mb-4 flex items-center">
            <span class="material-icons text-green-600 mr-2">shield</span>
            <h4 class="text-xl font-bold text-green-600">裝備比較</h4>
        </div>
    `;
    
    // 為每個裝備創建比較表格
    Object.keys(equipmentNames).forEach(eqKey => {
        const eqName = equipmentNames[eqKey];
        
        // 收集該裝備的所有欄位名稱
        const allFields = new Set();
        members.forEach(member => {
            if (member.equipment && member.equipment[eqKey]) {
                Object.keys(member.equipment[eqKey]).forEach(field => allFields.add(field));
            }
        });
        
        if (allFields.size === 0) {
            return; // 跳過無數據的裝備
        }
        
        html += `
            <div class="border rounded-lg overflow-hidden">
                <div class="bg-green-600 text-white px-4 py-2 font-bold flex items-center justify-between cursor-pointer hover:bg-green-700 transition"
                     onclick="window.toggleCompareModule('${eqKey}')">
                    <span>${eqName} (${allFields.size}項)</span>
                    <span class="material-icons module-toggle" id="compare-toggle-${eqKey}">expand_more</span>
                </div>
                <div id="compare-module-${eqKey}" class="overflow-x-auto" style="display: none;">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-2 px-3 border-r font-semibold sticky left-0 bg-gray-50">屬性</th>
                                ${members.map(m => `<th class="text-center py-2 px-3 font-semibold">${m.member_name}</th>`).join('')}
                                <th class="text-center py-2 px-3 bg-yellow-50 font-semibold">最高值</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // 顯示所有欄位
        const fieldsArray = Array.from(allFields);
        
        fieldsArray.forEach((field, idx) => {
            const values = members.map(member => {
                return member.equipment && member.equipment[eqKey] && member.equipment[eqKey][field] 
                    ? parseFloat(member.equipment[eqKey][field]) : 0;
            });
            
            const maxValue = Math.max(...values);
            
            html += `
                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50">
                    <td class="py-2 px-3 border-r font-medium sticky left-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">${field}</td>
                    ${values.map(v => {
                        const isMax = v === maxValue && maxValue > 0;
                        return `<td class="text-center py-2 px-3 ${isMax ? 'bg-green-100 font-bold text-green-700' : ''}">${v}</td>`;
                    }).join('')}
                    <td class="text-center py-2 px-3 bg-yellow-50 font-bold text-yellow-700">${maxValue}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    // 總分比較
    html += `
        <div class="border rounded-lg overflow-hidden">
            <div class="bg-yellow-600 text-white px-4 py-2 font-bold">
                技能總分比較
            </div>
            <div class="p-4">
                <div class="flex items-end space-x-4 justify-around">
                    ${members.map(member => {
                        const score = member.total_score || 0;
                        const maxScore = Math.max(...members.map(m => m.total_score || 0));
                        const isMax = score === maxScore && maxScore > 0;
                        const height = maxScore > 0 ? (score / maxScore * 200) : 20;
                        
                        return `
                            <div class="flex flex-col items-center">
                                <div class="text-2xl font-bold mb-2 ${isMax ? 'text-yellow-600' : 'text-gray-700'}">
                                    ${score}${isMax ? ' 👑' : ''}
                                </div>
                                <div class="${isMax ? 'bg-yellow-500' : 'bg-purple-500'} rounded-t-lg w-20 transition-all" 
                                     style="height: ${height}px; min-height: 20px;"></div>
                                <div class="text-sm font-semibold text-gray-700 mt-2">${member.member_name}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // 平滑滾動到結果區域
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 切換比較模組顯示/隱藏
window.toggleCompareModule = function(moduleKey) {
    const moduleContent = document.getElementById(`compare-module-${moduleKey}`);
    const toggleIcon = document.getElementById(`compare-toggle-${moduleKey}`);
    
    console.log('切換比較模組:', moduleKey, moduleContent, toggleIcon);
    
    if (moduleContent && toggleIcon) {
        if (moduleContent.style.display === 'none') {
            moduleContent.style.display = 'block';
            toggleIcon.textContent = 'expand_less';
            console.log('展開比較模組:', moduleKey);
        } else {
            moduleContent.style.display = 'none';
            toggleIcon.textContent = 'expand_more';
            console.log('折疊比較模組:', moduleKey);
        }
    } else {
        console.error('找不到比較元素:', moduleKey);
    }
}

// 展開所有比較模組
window.expandAllModules = function() {
    const moduleKeys = ['star', 'pattern', 'item', 'artifact', 'doll', 'transform', 'prof', 'elixir'];
    const equipmentKeys = ['eq_helmet', 'eq_tshirt', 'eq_badge', 'eq_shoulder', 'eq_weapon', 'eq_cloak', 
        'eq_armor', 'eq_armguard', 'eq_boots', 'eq_gloves', 'eq_pants', 'eq_earring1', 'eq_earring2',
        'eq_belt', 'eq_necklace', 'eq_ring1', 'eq_ring2', 'eq_ring3', 'eq_ring4', 
        'eq_bracelet1', 'eq_bracelet2', 'eq_bracelet3', 'eq_rune1', 'eq_rune2',
        'eq_guard_seal', 'eq_recover_seal', 'eq_crystal', 'eq_catalyst'];
    
    [...moduleKeys, ...equipmentKeys].forEach(key => {
        const moduleContent = document.getElementById(`compare-module-${key}`);
        const toggleIcon = document.getElementById(`compare-toggle-${key}`);
        if (moduleContent && toggleIcon) {
            moduleContent.style.display = 'block';
            toggleIcon.textContent = 'expand_less';
        }
    });
}

// 折疊所有比較模組
window.collapseAllModules = function() {
    const moduleKeys = ['star', 'pattern', 'item', 'artifact', 'doll', 'transform', 'prof', 'elixir'];
    const equipmentKeys = ['eq_helmet', 'eq_tshirt', 'eq_badge', 'eq_shoulder', 'eq_weapon', 'eq_cloak', 
        'eq_armor', 'eq_armguard', 'eq_boots', 'eq_gloves', 'eq_pants', 'eq_earring1', 'eq_earring2',
        'eq_belt', 'eq_necklace', 'eq_ring1', 'eq_ring2', 'eq_ring3', 'eq_ring4', 
        'eq_bracelet1', 'eq_bracelet2', 'eq_bracelet3', 'eq_rune1', 'eq_rune2',
        'eq_guard_seal', 'eq_recover_seal', 'eq_crystal', 'eq_catalyst'];
    
    [...moduleKeys, ...equipmentKeys].forEach(key => {
        const moduleContent = document.getElementById(`compare-module-${key}`);
        const toggleIcon = document.getElementById(`compare-toggle-${key}`);
        if (moduleContent && toggleIcon) {
            moduleContent.style.display = 'none';
            toggleIcon.textContent = 'expand_more';
        }
    });
}

// 查看成員詳情 - 從 Supabase 讀取
async function viewMemberDetail(memberName) {
    try {
        const { data: memberData, error } = await adminSupabase
            .from('combat_data')
            .select('*')
            .eq('member_name', memberName)
            .single();
        
        if (error || !memberData) {
            console.error('查詢錯誤:', error);
            alert('找不到該成員數據');
            return;
        }
        
        const member = memberData;
    
    // 創建詳情彈窗
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-gray-800">${member.member_name} 的戰力數據</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <span class="material-icons">close</span>
                </button>
            </div>
            
            <div class="mb-4 p-4 bg-purple-50 rounded-lg">
                <p class="text-lg font-semibold text-purple-600">總分：${member.total_score || 0} 分</p>
                <p class="text-sm text-gray-500">更新時間：${member.updated_at ? new Date(member.updated_at).toLocaleString() : '-'}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 守護星 -->
                ${member.star ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">守護星 (25項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.star).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.star).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 紋樣 -->
                ${member.pattern ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">紋樣 (24項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.pattern).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.pattern).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 道具收藏 -->
                ${member.item ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">道具收藏 (29項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.item).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.item).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 聖物卡 -->
                ${member.artifact ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">聖物卡 (25項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.artifact).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.artifact).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 魔法娃娃 -->
                ${member.doll ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">魔法娃娃 (31項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.doll).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.doll).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 變身卡 -->
                ${member.transform ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">變身卡 (31項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.transform).slice(0, 10).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                        <div class="text-gray-500 text-xs mt-2">...共 ${Object.keys(member.transform).length} 項數據</div>
                    </div>
                </div>` : ''}
                
                <!-- 熟練度 -->
                ${member.prof ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">熟練度 (7項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.prof).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                    </div>
                </div>` : ''}
                
                <!-- 哈芙萬能藥 -->
                ${member.elixir ? `
                <div class="border rounded-lg p-4">
                    <h4 class="font-bold text-purple-600 mb-2">哈芙萬能藥 (15項)</h4>
                    <div class="text-sm space-y-1">
                        ${Object.entries(member.elixir).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                    </div>
                </div>` : ''}
                
                <!-- 技能狀態 -->
                ${member.skill ? `
                <div class="border rounded-lg p-4 bg-yellow-50">
                    <h4 class="font-bold text-yellow-600 mb-2">技能狀態</h4>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between"><span>金技1:</span><span class="font-semibold">${member.skill['金技1'] ? '✓ 已開啟' : '✗ 未開啟'}</span></div>
                        <div class="flex justify-between"><span>金技2:</span><span class="font-semibold">${member.skill['金技2'] ? '✓ 已開啟' : '✗ 未開啟'}</span></div>
                        <div class="flex justify-between"><span>紫技滿技:</span><span class="font-semibold">${member.skill['紫技'] || 0}</span></div>
                        <div class="flex justify-between"><span>紅技滿技:</span><span class="font-semibold">${member.skill['紅技'] || 0}</span></div>
                        ${Object.entries(member.skill).filter(([key]) => !['金技1', '金技2', '紫技', '紅技'].includes(key)).map(([key, value]) => 
                            `<div class="flex justify-between"><span>${key}:</span><span class="font-semibold">${value}</span></div>`
                        ).join('')}
                    </div>
                </div>` : ''}
            </div>
            
            <!-- 裝備區塊 -->
            ${member.equipment ? `
            <div class="mt-6">
                <h4 class="text-lg font-bold text-green-600 mb-4 flex items-center">
                    <span class="material-icons mr-2">shield</span>
                    裝備數據
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    ${generateEquipmentDetail(member.equipment)}
                </div>
            </div>` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    } catch (err) {
        console.error('查看詳情錯誤:', err);
        alert('載入詳情失敗: ' + err.message);
    }
}

// 生成裝備詳情 HTML
function generateEquipmentDetail(equipment) {
    const equipmentNames = {
        eq_helmet: '頭盔',
        eq_tshirt: 'T恤',
        eq_badge: '徽章',
        eq_shoulder: '肩甲',
        eq_weapon: '武器',
        eq_cloak: '斗篷',
        eq_armor: '盔甲',
        eq_armguard: '臂甲',
        eq_boots: '靴子',
        eq_gloves: '手套',
        eq_pants: '褲子',
        eq_earring1: '耳環1',
        eq_earring2: '耳環2',
        eq_belt: '腰帶',
        eq_necklace: '項鍊',
        eq_ring1: '戒指1',
        eq_ring2: '戒指2',
        eq_ring3: '戒指3',
        eq_ring4: '戒指4',
        eq_bracelet1: '手環1',
        eq_bracelet2: '手環2',
        eq_bracelet3: '手環3',
        eq_rune1: '符石1',
        eq_rune2: '符石2',
        eq_guard_seal: '守護印章',
        eq_recover_seal: '恢復印章',
        eq_crystal: '水晶',
        eq_catalyst: '催化石'
    };
    
    let html = '';
    
    Object.keys(equipmentNames).forEach(eqKey => {
        const eqData = equipment[eqKey];
        const eqName = equipmentNames[eqKey];
        
        if (eqData && Object.keys(eqData).length > 0) {
            // 檢查是否有非零數據（排除裝備名稱欄位）
            const hasData = Object.entries(eqData).some(([k, v]) => k !== '裝備名稱' && v && v !== 0 && v !== '0');
            if (hasData || eqData['裝備名稱']) {
                const itemName = eqData['裝備名稱'] ? `<span class="text-green-600">(${eqData['裝備名稱']})</span>` : '';
                html += `
                    <div class="border border-green-200 rounded-lg p-3 bg-green-50">
                        <h5 class="font-semibold text-green-700 mb-2 text-sm">${eqName} ${itemName}</h5>
                        <div class="text-xs space-y-1">
                            ${Object.entries(eqData).filter(([k, v]) => k !== '裝備名稱' && v && v !== 0 && v !== '0').map(([key, value]) => 
                                `<div class="flex justify-between"><span class="text-gray-600">${key}:</span><span class="font-semibold">${value}</span></div>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
        }
    });
    
    return html || '<div class="text-gray-500 text-sm col-span-3">尚無裝備數據</div>';
}

// 切換維度展開/折疊
window.toggleDimension = function(dimensionKey) {
    const content = document.getElementById(`dim-content-${dimensionKey}`);
    const toggle = document.getElementById(`dim-toggle-${dimensionKey}`);
    
    if (content && toggle) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.textContent = 'expand_less';
        } else {
            content.style.display = 'none';
            toggle.textContent = 'expand_more';
        }
    }
};

// 顯示維度詳細比較
window.showDimensionDetails = function(dimensionKey) {
    const membersData = window.currentComparisonData;
    if (!membersData) return;
    
    const dimensionInfo = {
        survival: { name: '生存力', weights: ADMIN_SURVIVAL_WEIGHTS, color: 'red' },
        burst: { name: '爆發力', weights: ADMIN_BURST_WEIGHTS, color: 'orange' },
        penetration: { name: '穿透力', weights: ADMIN_PENETRATION_WEIGHTS, color: 'blue' },
        pvp: { name: 'PVP優勢', weights: ADMIN_PVP_WEIGHTS, color: 'purple' }
    };
    
    const dim = dimensionInfo[dimensionKey];
    if (!dim) return;
    
    // 獲取該維度的所有屬性
    const attrs = Object.keys(dim.weights);
    
    let html = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove()">
            <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <div class="bg-${dim.color}-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 class="text-2xl font-bold">${dim.name} - 詳細屬性比較</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-100 sticky top-0">
                                <tr>
                                    <th class="text-left py-3 px-4 font-bold">屬性</th>
                                    ${membersData.map(m => `<th class="text-center py-3 px-4 font-bold">${m.name}</th>`).join('')}
                                    <th class="text-center py-3 px-4 font-bold bg-yellow-100">差異</th>
                                </tr>
                            </thead>
                            <tbody>
    `;
    
    attrs.forEach((attr, idx) => {
        const values = membersData.map(m => m.stats[attr] ? m.stats[attr].total : 0);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const diff = maxValue - minValue;
        
        html += `
            <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer"
                onclick="window.showAttributeSource('${attr}')">>
                <td class="py-3 px-4 font-medium">${attr}</td>
                ${values.map(v => {
                    const isMax = v === maxValue && maxValue > 0;
                    const isMin = v === minValue && minValue > 0 && minValue < maxValue;
                    return `<td class="text-center py-3 px-4 ${isMax ? 'bg-green-100 font-bold text-green-700' : isMin ? 'bg-red-50 text-red-600' : ''}">${v}</td>`;
                }).join('')}
                <td class="text-center py-3 px-4 font-bold ${diff > 0 ? 'text-orange-600 bg-yellow-50' : 'text-gray-400'}">${diff > 0 ? diff : '-'}</td>
            </tr>
        `;
    });
    
    html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <span class="material-icons text-sm align-middle">info</span>
                        點擊任一屬性行可查看該屬性在各模組的來源
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
};

// 顯示屬性來源詳情
window.showAttributeSource = function(attrName) {
    const membersData = window.currentComparisonData;
    if (!membersData) return;
    
    const membersStatData = membersData.map(m => ({
        name: m.name,
        stat: m.stats[attrName]
    }));
    
    let html = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove()">
            <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <div class="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 class="text-xl font-bold">${attrName} - 來源詳情</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div class="grid grid-cols-${membersStatData.length} gap-4">
    `;
    
    membersStatData.forEach(memberData => {
        const stat = memberData.stat;
        const total = stat && stat.total ? stat.total : 0;
        const sources = stat && stat.sources && Array.isArray(stat.sources) ? stat.sources : [];
        
        html += `
            <div class="border rounded-lg overflow-hidden">
                <div class="bg-purple-100 px-4 py-2 font-bold text-purple-800">
                    ${memberData.name}
                    <div class="text-2xl font-bold text-purple-600 mt-1">${total}</div>
                </div>
                <div class="p-4">
                    ${sources.length > 0 ? `
                        <div class="space-y-2">
                            ${sources.filter(s => s && s.source && s.value !== undefined).map(s => `
                                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span class="text-sm text-gray-700">${s.source}</span>
                                    <span class="font-bold text-gray-900">+${s.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="text-gray-400 text-sm text-center py-4">無此屬性</div>'}
                </div>
            </div>
        `;
    });
    
    html += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
};

// 綁定載入按鈕事件
document.addEventListener('DOMContentLoaded', function() {
    const loadBtn = document.getElementById('loadDataBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadAdminData);
    }
});
