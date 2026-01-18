// 全域變數
let currentUser = null;
var supabaseClient = null;

// 模組定義
const MODULES = {
    star: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '力量', '敏捷', '傷害減免',
        '最大HP', 'PVP傷害減免', '無視傷害減免',
        '近距離爆擊', '無視PVP傷害減免', '傷害減少',
        '昏迷狀態傷害減免', '連續傷害減免', '無視傷害減少',
        '爆擊時追加近距離傷害', '近距離爆擊抗性', '昏迷命中',
        '昏迷抗性', 'PVP近距離附加傷害', '無視近距離傷害減免',
        '爆擊傷害減免', '減少近距離傷害', '阻擋武器',
        '持續傷害減少'
    ],
    
    pattern: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '傷害減免', '最大HP', 'PVP附加傷害',
        'PVP傷害減免', '藥水恢復率', '藥水恢復量',
        '無視傷害減免', '近距離爆擊', '無視PVP傷害減免', '藥水冷卻時間減少',
        '傷害減少', '昏迷狀態傷害減免', '疊加傷害減免',
        '破壞盔甲傷害減少', 'HP30%以下傷害量減少', '無視傷害減少',
        '爆擊時追加近距離傷害', '昏迷命中', '昏迷抗性',
        '無視近距離傷害減免', '爆擊傷害減免', 'PVP傷害減少無視'
    ],
    
    item: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '力量', '敏捷', '傷害減免',
        '最大HP', 'PVP傷害減免', '藥水恢復率',
        '藥水恢復量', '近距離迴避力', '無視傷害減免',
        '近距離爆擊', '無視PVP傷害減免', '移動速度',
        '攻擊速度', '藥水冷卻時間減少', '無視傷害減少',
        '近距離爆擊抗性', '昏迷命中', '昏迷抗性',
        'PVP近距離附加傷害', '無視近距離傷害減免', '爆擊傷害減免',
        '減少近距離傷害', '阻擋武器', '持續傷害減少',
        'PVP傷害減少', 'PVP傷害減少無視'
    ],
    
    artifact: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '力量', '敏捷', '傷害減免',
        '最大HP', 'PVP傷害減免', '藥水恢復率',
        '藥水恢復量', '無視傷害減免', '無視PVP傷害減免',
        '攻擊速度', '無視傷害減少', '爆擊時追加近距離傷害',
        '近距離爆擊抗性', '昏迷命中', '昏迷抗性',
        'PVP近距離附加傷害', '無視近距離傷害減免', '減少近距離傷害',
        '阻擋武器', '無視近距離傷害減少', 'PVP傷害減少',
        'PVP傷害減少無視', 'PVP近距離迴避力'
    ],
    
    doll: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '力量', '敏捷', '傷害減免',
        '最大HP', 'PVP傷害減免', '藥水恢復率',
        '藥水恢復量', '近距離迴避力', '無視傷害減免',
        '近距離爆擊', '無視PVP傷害減免', '移動速度',
        '攻擊速度', '昏迷狀態傷害減免', '連續傷害減免',
        '爆擊時追加近距離傷害', '近距離爆擊抗性', '昏迷命中',
        '昏迷抗性', 'PVP近距離附加傷害', '無視近距離傷害減免',
        '爆擊傷害減免', '減少近距離傷害', '阻擋武器',
        '持續傷害減少', 'PVP傷害減少', 'PVP近距離迴避力',
        'PVP無視近距離迴避力'
    ],
    
    transform: [
        '物理防禦力', '近距離命中', '近距離傷害',
        '力量', '敏捷', '傷害減免',
        '最大HP', 'PVP傷害減免', '藥水恢復率',
        '藥水恢復量', '近距離迴避力', '無視傷害減免',
        '近距離爆擊', '無視PVP傷害減免', '移動速度',
        '攻擊速度', '昏迷狀態傷害減免', '連續傷害減免',
        '無視傷害減少', '爆擊時追加近距離傷害', '近距離爆擊抗性',
        '昏迷命中', '昏迷抗性', 'PVP近距離附加傷害',
        '無視近距離傷害減免', '爆擊傷害減免', '減少近距離傷害',
        '阻擋武器', '無視近距離傷害減少', 'PVP近距離迴避力',
        'PVP無視近距離迴避力'
    ],
    
    prof: [
        '近距離命中', '攻擊速度', 'PVP近距離附加傷害',
        '無視傷害減免', '近距離傷害', '近距離爆擊',
        '無視PVP傷害減免'
    ],
    
    elixir: [
        '近距離傷害', '物理防禦力', '近距離命中',
        '昏迷命中', '昏迷抗性', '最大HP',
        '傷害減免', '無視近距離迴避力', 'PVP傷害減免',
        '減少近距離傷害', 'PVP傷害減少', '持續傷害減少',
        '屬性傷害減免', 'PVP近距離迴避力', 'PVP無視近距離迴避力'
    ],
    
    skill: [
        { name: '金技1', type: 'checkbox' },
        { name: '金技1等級', type: 'number', label: '金技1幾等' },
        { name: '金技2', type: 'checkbox' },
        { name: '金技2等級', type: 'number', label: '金技2幾等' },
        { name: '紫技滿技', type: 'checkbox' },
        { name: '紫技等級', type: 'number', label: '紫技幾等' },
        { name: '紅技滿技', type: 'checkbox' },
        { name: '紅技等級', type: 'number', label: '紅技幾等' }
    ],
    
    // ===== 裝備模組 =====
    eq_helmet: ['物理防禦力', 'PVP傷害減免', '昏迷抗性'],
    eq_tshirt: ['物理防禦力', '力量', '敏捷', '傷害減免', '昏迷抗性'],
    eq_badge: ['物理防禦力', '最大HP', 'PVP傷害減免', '昏迷命中', '昏迷抗性'],
    eq_shoulder: ['物理防禦力', '近距離命中', '近距離傷害', '力量', '傷害減免', '昏迷命中', '昏迷抗性'],
    eq_weapon: ['近距離命中', '近距離傷害', '力量', '傷害增加', '無視近距離迴避力', '昏迷命中'],
    eq_cloak: ['物理防禦力', '近距離命中', '近距離傷害', '力量', 'PVP傷害減免', '最大HP', '無視PVP傷害減免', 'PVP傷害減少無視', '傷害減免', '爆擊傷害減免'],
    eq_armor: ['物理防禦力', '近距離命中', '近距離傷害', '無視近距離傷害減少', '傷害減免', '爆擊傷害減免'],
    eq_armguard: ['物理防禦力', '近距離傷害', '力量', '傷害減免', '昏迷命中', '爆擊傷害減免', '最大HP', '昏迷抗性', 'PVP傷害減免'],
    eq_boots: ['物理防禦力', '力量', '傷害減免', 'PVP傷害減免', '最大HP', '爆擊傷害減免'],
    eq_gloves: ['物理防禦力', '近距離命中', '近距離傷害', '力量', '昏迷命中', '傷害減免', 'PVP傷害減免'],
    eq_pants: ['物理防禦力', '力量', '傷害減免', 'PVP傷害減免', '無視傷害減免', '持續傷害減少', '最大HP'],
    eq_earring1: ['物理防禦力', '藥水恢復率', '藥水恢復量'],
    eq_earring2: ['物理防禦力', '近距離傷害', '機率附加傷害', '最大HP', '藥水恢復率', '藥水恢復量', '無視傷害減免', '昏迷命中'],
    eq_belt: ['物理防禦力', '力量', '傷害減免', '最大HP', '近距離爆擊抗性', '昏迷命中', '無視傷害減免', '藥水恢復率', '藥水恢復量'],
    eq_necklace: ['物理防禦力', '力量', '最大HP', '近距離迴避力', '無視近距離迴避力', '昏迷命中', '昏迷抗性', '藥水恢復率'],
    eq_ring1: ['物理防禦力', '近距離命中', '近距離傷害', '最大HP', '無視傷害減免', '無視PVP傷害減免', '昏迷命中', '昏迷抗性', '藥水恢復率'],
    eq_ring2: ['物理防禦力', '近距離命中', '近距離傷害', '最大HP', '無視傷害減免', '昏迷命中', '昏迷抗性', '藥水恢復率', '藥水恢復量'],
    eq_ring3: ['物理防禦力', '近距離命中', '近距離傷害', '最大HP', '攻擊速度', '昏迷抗性'],
    eq_ring4: ['物理防禦力', '近距離命中', '近距離傷害', '最大HP', '攻擊速度', '昏迷抗性'],
    eq_bracelet1: ['物理防禦力', '力量', '最大HP', '近距離爆擊', '移動速度', '攻擊速度', '無視近距離迴避力', '昏迷命中', '藥水恢復率', '藥水恢復量', 'PVP傷害減免'],
    eq_bracelet2: ['物理防禦力', '敏捷', '力量', '移動速度', '昏迷命中', '最大HP', '藥水恢復率', '藥水恢復量', '近距離爆擊', '攻擊速度', '無視近距離迴避力', '近距離命中'],
    eq_bracelet3: ['物理防禦力', '傷害減免', '移動速度', '傷害減少', '昏迷抗性', '近距離傷害'],
    eq_rune1: ['物理防禦力', '近距離命中', '近距離傷害', '力量', '無視PVP傷害減免', '最大HP'],
    eq_rune2: ['物理防禦力', '昏迷命中', '無視近距離傷害減少', '藥水恢復率', '無視近距離迴避力', '昏迷抗性'],
    eq_guard_seal: ['近距離命中', '近距離傷害', '昏迷抗性'],
    eq_recover_seal: ['傷害減免', '藥水恢復率', '藥水恢復量', '藥水冷卻時間減少', '昏迷抗性'],
    eq_crystal: ['近距離爆擊', '攻擊速度', '無視傷害減少', '昏迷抗性', '決勝一擊', '決勝一擊增幅率', '近距離命中', '近距離傷害', '無視傷害減免'],
    eq_catalyst: ['物理防禦力', '近距離命中', '近距離傷害', '力量', '力量增加%數']
};

// 裝備名稱對照
const EQUIPMENT_NAMES = {
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

// 更新角色類型提示
function updateTypeNotice(type) {
    const notice = document.getElementById('typeNotice');
    if (!notice) return;
    
    const typeNames = {
        'melee': '近戰',
        'mage': '法師',
        'ranged': '遠攻'
    };
    
    const typeName = typeNames[type] || '近戰';
    
    notice.innerHTML = `
        <div class="flex items-center">
            <span class="material-icons text-blue-600 mr-2">info</span>
            <span class="text-sm text-blue-800">
                目前顯示：<strong>${typeName}</strong> 角色的模組數值
            </span>
        </div>
    `;
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 系統初始化 ===');
    initSupabase();
    initNavigation();
    initModules();
    initAuth();
    loadUserData();
});

// 初始化 Supabase
function initSupabase() {
    if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.key && 
        SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        // 暴露到全域供 admin.js 使用
        window.supabaseClient = supabaseClient;
        console.log('✓ Supabase 已初始化');
    } else {
        console.log('ℹ Supabase 未配置，使用離線模式');
    }
}

// 初始化導覽
function initNavigation() {
    // 頂部導覽按鈕
    const navBtns = document.querySelectorAll('.top-nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // 模組 Tab 按鈕
    const moduleBtns = document.querySelectorAll('.module-tab-btn');
    moduleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            showModule(module);
        });
    });
    
    console.log('✓ 導覽系統已初始化');
}

// 顯示頁面
function showPage(pageName) {
    // 隱藏所有頁面
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // 顯示指定頁面
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新導覽按鈕狀態
    document.querySelectorAll('.top-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('active');
        }
    });
    
    // 如果切換到看板頁面，自動載入數據
    if (pageName === 'stats-view') {
        loadStatsView();
    }
    
    // 如果切換到我的數據頁面，載入角色列表
    if (pageName === 'my-stats') {
        loadMemberList();
    }
}

// 顯示模組
function showModule(moduleName) {
    // 隱藏所有模組
    document.querySelectorAll('.module-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 顯示指定模組
    const targetModule = document.getElementById(`module-${moduleName}`);
    if (targetModule) {
        targetModule.classList.add('active');
    }
    
    // 更新模組按鈕狀態
    document.querySelectorAll('.module-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'shadow', 'text-purple-600');
        if (btn.getAttribute('data-module') === moduleName) {
            btn.classList.add('active', 'bg-white', 'shadow', 'text-purple-600');
        }
    });
}

// 初始化模組
function initModules() {
    // 初始化基本模組
    Object.keys(MODULES).forEach(moduleKey => {
        // 跳過裝備模組，稍後單獨處理
        if (moduleKey.startsWith('eq_')) return;
        
        const container = document.getElementById(`${moduleKey}-fields`);
        if (!container) return;
        
        const fields = MODULES[moduleKey];
        container.innerHTML = '';
        
        fields.forEach((field, index) => {
            if (moduleKey === 'skill') {
                // 技能模組特殊處理
                const fieldGroup = document.createElement('div');
                fieldGroup.className = 'field-group';
                
                if (field.type === 'checkbox') {
                    fieldGroup.innerHTML = `
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" id="${moduleKey}_${field.name}" 
                                   class="w-4 h-4 text-purple-600 rounded">
                            <span class="field-label mb-0">${field.name}</span>
                        </label>
                    `;
                } else {
                    fieldGroup.innerHTML = `
                        <label class="field-label">${field.label || field.name}</label>
                        <input type="number" id="${moduleKey}_${field.name}" 
                               class="field-input" min="0" step="1">
                    `;
                }
                
                container.appendChild(fieldGroup);
            } else {
                // 一般模組
                const fieldGroup = document.createElement('div');
                fieldGroup.className = 'field-group';
                fieldGroup.innerHTML = `
                    <label class="field-label">${field}</label>
                    <input type="number" id="${moduleKey}_${index}" 
                           class="field-input" min="0" step="0.01">
                `;
                container.appendChild(fieldGroup);
            }
        });
    });
    
    // 初始化裝備模組（可展開折疊）
    initEquipmentModule();
    
    // 儲存按鈕
    document.getElementById('saveBtn').addEventListener('click', saveData);
    
    // 角色類型選擇器
    const characterTypeSelect = document.getElementById('characterType');
    if (characterTypeSelect) {
        characterTypeSelect.addEventListener('change', function() {
            updateTypeNotice(this.value);
            // 未來可以在這裡切換不同類型的模組欄位
            if (this.value !== 'melee') {
                alert('此角色類型的模組配置即將推出，敬請期待！');
                this.value = 'melee'; // 暫時切回近戰
            }
        });
    }
    
    // 角色選擇器 - 載入已有角色列表
    const memberSelector = document.getElementById('memberSelector');
    if (memberSelector) {
        memberSelector.addEventListener('change', function() {
            const selectedName = this.value;
            if (selectedName) {
                document.getElementById('memberName').value = selectedName;
                loadUserDataByName(selectedName);
            } else {
                // 選擇新角色時清空表單
                clearAllFields();
                document.getElementById('memberName').value = '';
                document.getElementById('memberClass').value = '';
            }
        });
        
        // 載入角色列表
        loadMemberList();
    }
    
    // 角色名稱輸入框 - 自動載入已有數據
    const memberNameInput = document.getElementById('memberName');
    if (memberNameInput) {
        memberNameInput.addEventListener('blur', function() {
            const memberName = this.value.trim();
            if (memberName) {
                loadUserDataByName(memberName);
            }
        });
        
        // 也可以按 Enter 載入
        memberNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const memberName = this.value.trim();
                if (memberName) {
                    loadUserDataByName(memberName);
                }
            }
        });
    }
    
    console.log('✓ 模組已初始化');
}

// 初始化裝備模組
function initEquipmentModule() {
    const container = document.getElementById('equipment-fields');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 獲取所有裝備 key
    const equipmentKeys = Object.keys(MODULES).filter(key => key.startsWith('eq_'));
    
    equipmentKeys.forEach((eqKey, eqIndex) => {
        const eqName = EQUIPMENT_NAMES[eqKey] || eqKey;
        const fields = MODULES[eqKey];
        
        const eqBlock = document.createElement('div');
        eqBlock.className = 'border rounded-lg overflow-hidden mb-2';
        eqBlock.innerHTML = `
            <div class="bg-green-100 px-4 py-2 font-semibold text-green-800 flex items-center justify-between cursor-pointer hover:bg-green-200 transition"
                 onclick="toggleEquipment('${eqKey}')">
                <span>${eqIndex + 1}. ${eqName} (${fields.length}項)</span>
                <span class="material-icons eq-toggle" id="eq-toggle-${eqKey}">expand_more</span>
            </div>
            <div id="eq-content-${eqKey}" class="p-4 bg-white" style="display: none;">
                <div class="mb-3 pb-3 border-b">
                    <label class="field-label text-sm text-green-700 font-semibold">裝備名稱</label>
                    <input type="text" id="${eqKey}_name" 
                           class="field-input border-green-300 focus:border-green-500" 
                           placeholder="輸入${eqName}名稱"
                           onchange="prefillEquipmentValues('${eqKey}')">
                    <p id="${eqKey}_hint" class="text-xs text-gray-400 mt-1" style="display: none;"></p>
                </div>
                <div class="grid grid-cols-3 gap-3" id="eq-fields-${eqKey}"></div>
            </div>
        `;
        container.appendChild(eqBlock);
        
        // 生成該裝備的輸入欄位
        const fieldsContainer = document.getElementById(`eq-fields-${eqKey}`);
        fields.forEach((field, fieldIndex) => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'field-group';
            fieldGroup.innerHTML = `
                <label class="field-label text-sm">${field}</label>
                <input type="number" id="${eqKey}_${fieldIndex}" 
                       class="field-input" min="0" step="0.01" placeholder="0">
            `;
            fieldsContainer.appendChild(fieldGroup);
        });
    });
}

// 根據裝備名稱預填數值 - 從 Supabase 搜尋
window.prefillEquipmentValues = async function(eqKey) {
    const nameInput = document.getElementById(`${eqKey}_name`);
    const hintEl = document.getElementById(`${eqKey}_hint`);
    if (!nameInput) return;
    
    const equipmentName = nameInput.value.trim();
    if (!equipmentName) {
        if (hintEl) hintEl.style.display = 'none';
        return;
    }
    
    if (!supabaseClient) {
        if (hintEl) {
            hintEl.innerHTML = `<span class="text-gray-500">離線模式，無法搜尋</span>`;
            hintEl.style.display = 'block';
        }
        return;
    }
    
    // 顯示搜尋中
    if (hintEl) {
        hintEl.innerHTML = `<span class="text-blue-500">搜尋中...</span>`;
        hintEl.style.display = 'block';
    }
    
    try {
        // 從 Supabase 搜尋所有角色的裝備數據
        const { data: allData, error } = await supabaseClient
            .from('combat_data')
            .select('member_name, equipment');
        
        if (error) {
            console.error('搜尋裝備錯誤:', error);
            if (hintEl) {
                hintEl.innerHTML = `<span class="text-red-500">搜尋失敗</span>`;
            }
            return;
        }
        
        // 搜尋相同裝備名稱
        let foundData = null;
        let foundFrom = null;
        
        for (const record of (allData || [])) {
            if (record.equipment && record.equipment[eqKey]) {
                const eqData = record.equipment[eqKey];
                if (eqData['裝備名稱'] === equipmentName) {
                    foundData = eqData;
                    foundFrom = record.member_name;
                    break;
                }
            }
        }
        
        if (foundData && foundFrom) {
            // 預填數值
            const fields = MODULES[eqKey];
            fields.forEach((field, fieldIndex) => {
                const inputId = `${eqKey}_${fieldIndex}`;
                const input = document.getElementById(inputId);
                if (input && foundData[field] !== undefined) {
                    input.value = foundData[field];
                    // 加上視覺提示（淺綠色背景）
                    input.classList.add('bg-green-50');
                }
            });
            
            // 顯示提示訊息
            if (hintEl) {
                hintEl.innerHTML = `<span class="text-green-600">✓ 已從「${foundFrom}」預填數值，請確認後存檔</span>`;
                hintEl.style.display = 'block';
            }
        } else {
            // 沒找到，清除提示
            if (hintEl) {
                hintEl.innerHTML = `<span class="text-gray-500">此裝備尚無其他角色登記過</span>`;
                hintEl.style.display = 'block';
            }
            
            // 清除視覺提示
            const fields = MODULES[eqKey];
            fields.forEach((field, fieldIndex) => {
                const inputId = `${eqKey}_${fieldIndex}`;
                const input = document.getElementById(inputId);
                if (input) {
                    input.classList.remove('bg-green-50');
                }
            });
        }
    } catch (err) {
        console.error('搜尋裝備錯誤:', err);
        if (hintEl) {
            hintEl.innerHTML = `<span class="text-red-500">搜尋失敗</span>`;
        }
    }
}

// 切換裝備展開/折疊
window.toggleEquipment = function(eqKey) {
    const content = document.getElementById(`eq-content-${eqKey}`);
    const toggle = document.getElementById(`eq-toggle-${eqKey}`);
    
    if (content && toggle) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.textContent = 'expand_less';
        } else {
            content.style.display = 'none';
            toggle.textContent = 'expand_more';
        }
    }
}

// 儲存數據
async function saveData() {
    const memberName = document.getElementById('memberName').value.trim();
    const memberClass = document.getElementById('memberClass').value.trim();
    const characterType = document.getElementById('characterType').value;
    
    if (!memberName) {
        alert('請輸入角色名稱');
        return;
    }
    
    if (!memberClass) {
        alert('請輸入職業');
        return;
    }
    
    const data = {
        member_name: memberName,
        member_class: memberClass,
        character_type: characterType,
        star: collectModuleData('star'),
        pattern: collectModuleData('pattern'),
        item: collectModuleData('item'),
        artifact: collectModuleData('artifact'),
        doll: collectModuleData('doll'),
        transform: collectModuleData('transform'),
        prof: collectModuleData('prof'),
        elixir: collectModuleData('elixir'),
        skill: collectSkillData(),
        // 裝備數據
        equipment: collectAllEquipmentData(),
        total_score: calculateTotalScore(),
        updated_at: new Date().toISOString()
    };
    
    console.log('儲存數據:', data);
    
    // 計算戰力分數
    const combatPower = {
        total: calculateCombatPower(data, 'total'),
        survival: calculateCombatPower(data, 'survival'),
        burst: calculateCombatPower(data, 'burst'),
        penetration: calculateCombatPower(data, 'penetration'),
        pvp: calculateCombatPower(data, 'pvp')
    };
    
    // 準備 Supabase 數據
    const supabaseData = {
        member_name: memberName,
        member_class: memberClass,
        character_type: characterType,
        star: data.star,
        pattern: data.pattern,
        item: data.item,
        artifact: data.artifact,
        doll: data.doll,
        transform: data.transform,
        prof: data.prof,
        elixir: data.elixir,
        skill: data.skill,
        equipment: data.equipment,
        combat_power: combatPower,
        updated_at: new Date().toISOString()
    };
    
    // 儲存到 Supabase
    if (supabaseClient) {
        try {
            // 先檢查是否存在
            const { data: existing } = await supabaseClient
                .from('combat_data')
                .select('id')
                .eq('member_name', memberName)
                .single();
            
            let error;
            if (existing) {
                // 更新
                const result = await supabaseClient
                    .from('combat_data')
                    .update(supabaseData)
                    .eq('member_name', memberName);
                error = result.error;
            } else {
                // 新增
                const result = await supabaseClient
                    .from('combat_data')
                    .insert(supabaseData);
                error = result.error;
            }
            
            if (error) {
                console.error('Supabase 錯誤:', error);
                alert('儲存失敗：' + error.message);
            } else {
                alert('數據儲存成功！');
                // 重新載入角色列表
                loadMemberList();
            }
        } catch (err) {
            console.error('儲存錯誤:', err);
            alert('儲存失敗: ' + err.message);
        }
    } else {
        alert('無法連接資料庫');
    }
}

// 收集模組數據
function collectModuleData(moduleKey) {
    const data = {};
    const fields = MODULES[moduleKey];
    
    fields.forEach((field, index) => {
        const input = document.getElementById(`${moduleKey}_${index}`);
        if (input) {
            data[field] = parseFloat(input.value) || 0;
        }
    });
    
    return data;
}

// 收集技能數據
function collectSkillData() {
    const data = {};
    const fields = MODULES.skill;
    
    fields.forEach(field => {
        const input = document.getElementById(`skill_${field.name}`);
        if (input) {
            if (field.type === 'checkbox') {
                data[field.name] = input.checked;
            } else {
                data[field.name] = parseInt(input.value) || 0;
            }
        }
    });
    
    return data;
}

// 收集所有裝備數據
function collectAllEquipmentData() {
    const equipmentData = {};
    const equipmentKeys = Object.keys(MODULES).filter(key => key.startsWith('eq_'));
    
    equipmentKeys.forEach(eqKey => {
        const data = collectModuleData(eqKey);
        // 收集裝備名稱
        const nameInput = document.getElementById(`${eqKey}_name`);
        if (nameInput && nameInput.value.trim()) {
            data['裝備名稱'] = nameInput.value.trim();
        }
        equipmentData[eqKey] = data;
    });
    
    return equipmentData;
}

// 計算總分
function calculateTotalScore() {
    let score = 0;
    
    // 技能分數
    const skill = collectSkillData();
    
    // 金技1分數（有金技+10，等級加分）
    if (skill['金技1']) score += 10;
    score += (skill['金技1等級'] || 0);
    
    // 金技2分數（有金技+10，等級加分）
    if (skill['金技2']) score += 10;
    score += (skill['金技2等級'] || 0);
    
    // 紫技分數（滿技+5，等級加分）
    if (skill['紫技滿技']) score += 5;
    score += (skill['紫技等級'] || 0);
    
    // 紅技分數（滿技+5，等級加分）
    if (skill['紅技滿技']) score += 5;
    score += (skill['紅技等級'] || 0);
    
    return score;
}
// 載入角色列表到選擇器
async function loadMemberList() {
    const selector = document.getElementById('memberSelector');
    if (!selector || !supabaseClient) return;
    
    try {
        const { data: members, error } = await supabaseClient
            .from('combat_data')
            .select('member_name, member_class')
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        // 清空現有選項（保留第一個預設選項）
        selector.innerHTML = '<option value="">-- 新角色或手動輸入 --</option>';
        
        // 添加角色選項
        if (members && members.length > 0) {
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.member_name;
                option.textContent = `${member.member_name} (${member.member_class || '未設定職業'})`;
                selector.appendChild(option);
            });
        }
    } catch (err) {
        console.error('載入角色列表錯誤:', err);
    }
}
// 載入使用者數據（按名稱）- 從 Supabase
async function loadUserDataByName(memberName) {
    if (!memberName) return;
    
    if (!supabaseClient) {
        showNotification('無法連接資料庫', 'error');
        return;
    }
    
    try {
        const { data: savedData, error } = await supabaseClient
            .from('combat_data')
            .select('*')
            .eq('member_name', memberName)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('載入錯誤:', error);
        }
        
        if (savedData) {
            populateFields(savedData);
            
            // 顯示提示訊息
            const memberNameInput = document.getElementById('memberName');
            if (memberNameInput) {
                const originalBg = memberNameInput.style.backgroundColor;
                memberNameInput.style.backgroundColor = '#d1fae5';
                setTimeout(() => {
                    memberNameInput.style.backgroundColor = originalBg;
                }, 1000);
            }
            
            // 顯示通知
            showNotification(`已載入 ${memberName} 的數據`, 'success');
            console.log('✓ 已從 Supabase 載入數據:', memberName);
        } else {
            // 新角色
            clearAllFields();
            showNotification(`${memberName} 是新角色，請填寫數據`, 'info');
            console.log('ℹ 新角色:', memberName);
        }
    } catch (err) {
        console.error('載入錯誤:', err);
        showNotification('載入數據失敗', 'error');
    }
}

// 載入使用者數據（舊方法，保持兼容）
function loadUserData() {
    const memberName = document.getElementById('memberName').value.trim();
    if (memberName) {
        loadUserDataByName(memberName);
    }
}

// 清空所有欄位
function clearAllFields() {
    // 清空所有數值模組
    Object.keys(MODULES).forEach(moduleKey => {
        if (moduleKey === 'skill') {
            MODULES.skill.forEach(field => {
                const input = document.getElementById(`skill_${field.name}`);
                if (input) {
                    if (field.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                }
            });
        } else if (moduleKey.startsWith('eq_')) {
            // 裝備模組
            const fields = MODULES[moduleKey];
            fields.forEach((field, index) => {
                const input = document.getElementById(`${moduleKey}_${index}`);
                if (input) {
                    input.value = '';
                }
            });
        } else {
            const fields = MODULES[moduleKey];
            fields.forEach((field, index) => {
                const input = document.getElementById(`${moduleKey}_${index}`);
                if (input) {
                    input.value = '';
                }
            });
        }
    });
}

// 顯示通知訊息
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.textContent = message;
    notification.style.animation = 'fadeIn 0.3s ease-in';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 填充表單
function populateFields(data) {
    // 填充職業和類型
    if (data.member_class) {
        const classInput = document.getElementById('memberClass');
        if (classInput) classInput.value = data.member_class;
    }
    
    if (data.character_type) {
        const typeSelect = document.getElementById('characterType');
        if (typeSelect) {
            typeSelect.value = data.character_type;
            updateTypeNotice(data.character_type);
        }
    }
    
    // 填充模組數據
    Object.keys(MODULES).forEach(moduleKey => {
        // 跳過裝備模組，稍後單獨處理
        if (moduleKey.startsWith('eq_')) return;
        
        if (moduleKey === 'skill') {
            // 技能特殊處理
            if (data.skill) {
                MODULES.skill.forEach(field => {
                    const input = document.getElementById(`skill_${field.name}`);
                    if (input) {
                        if (field.type === 'checkbox') {
                            input.checked = data.skill[field.name] || false;
                        } else {
                            input.value = data.skill[field.name] || 0;
                        }
                    }
                });
            }
        } else {
            // 一般模組
            if (data[moduleKey]) {
                const fields = MODULES[moduleKey];
                fields.forEach((field, index) => {
                    const input = document.getElementById(`${moduleKey}_${index}`);
                    if (input && data[moduleKey][field] !== undefined) {
                        input.value = data[moduleKey][field];
                    }
                });
            }
        }
    });
    
    // 填充裝備數據
    if (data.equipment) {
        Object.keys(data.equipment).forEach(eqKey => {
            const eqData = data.equipment[eqKey];
            const fields = MODULES[eqKey];
            if (fields && eqData) {
                // 填充裝備名稱
                const nameInput = document.getElementById(`${eqKey}_name`);
                if (nameInput && eqData['裝備名稱']) {
                    nameInput.value = eqData['裝備名稱'];
                }
                // 填充數值欄位
                fields.forEach((field, index) => {
                    const input = document.getElementById(`${eqKey}_${index}`);
                    if (input && eqData[field] !== undefined) {
                        input.value = eqData[field];
                    }
                });
            }
        });
    }
}

// 初始化認證系統
function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // 登入按鈕
    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
    });
    
    // 關閉模態視窗
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
        clearAuthErrors();
    });
    
    // 登入表單提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        clearAuthErrors();
        
        // 使用 Supabase 認證
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('password_hash', await hashPassword(password))
                    .single();
                
                if (error || !data) {
                    showAuthError('login', '帳號或密碼錯誤');
                    return;
                }
                
                if (!data.is_active) {
                    showAuthError('login', '此帳號已被停用，請聯繫管理員');
                    return;
                }
                
                // 更新最後登入時間
                await supabaseClient
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', data.id);
                
                currentUser = {
                    id: data.id,
                    email: data.email,
                    username: data.game_character_id,
                    role: data.role
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUIAfterLogin();
                loginModal.classList.add('hidden');
                loginModal.classList.remove('flex');
                showToast('登入成功！', 'success');
                
            } catch (err) {
                console.error('登入錯誤:', err);
                showAuthError('login', '登入失敗，請稍後再試');
            }
        } else {
            // 離線模式：使用本地帳號
            if (email === 'admin@aden.com' && password === 'admin123') {
                currentUser = { id: 'local-admin', email: email, username: '管理員', role: 'admin' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUIAfterLogin();
                loginModal.classList.add('hidden');
                loginModal.classList.remove('flex');
                showToast('登入成功（離線模式）', 'success');
            } else {
                showAuthError('login', '帳號或密碼錯誤');
            }
        }
    });
    
    // 註冊表單提交
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const gameId = document.getElementById('registerGameId').value.trim();
        
        clearAuthErrors();
        
        // 驗證
        if (password !== confirmPassword) {
            showAuthError('register', '兩次輸入的密碼不一致');
            return;
        }
        
        if (password.length < 6) {
            showAuthError('register', '密碼至少需要6個字元');
            return;
        }
        
        if (!supabaseClient) {
            showAuthError('register', '目前為離線模式，無法註冊新帳號');
            return;
        }
        
        try {
            // 檢查 email 是否已存在
            const { data: existing } = await supabaseClient
                .from('users')
                .select('id')
                .eq('email', email)
                .single();
            
            if (existing) {
                showAuthError('register', '此電子郵件已被註冊');
                return;
            }
            
            // 建立新用戶（預設 viewer，等待管理員審核）
            const { data, error } = await supabaseClient
                .from('users')
                .insert({
                    email: email,
                    password_hash: await hashPassword(password),
                    game_character_id: gameId,
                    role: 'viewer'
                })
                .select()
                .single();
            
            if (error) {
                console.error('註冊錯誤:', error);
                showAuthError('register', '註冊失敗：' + error.message);
                return;
            }
            
            showAuthSuccess('register', '註冊成功！請等待管理員審核後即可登入使用');
            document.getElementById('registerForm').reset();
            
            // 自動切換到登入頁
            setTimeout(() => {
                switchAuthTab('login');
                document.getElementById('loginEmail').value = email;
            }, 1500);
            
        } catch (err) {
            console.error('註冊錯誤:', err);
            showAuthError('register', '註冊失敗，請稍後再試');
        }
    });
    
    // 登出按鈕
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUIAfterLogout();
        showToast('已登出', 'info');
    });
    
    // 檢查是否已有保存的登入狀態
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIAfterLogin();
        console.log('✓ 已自動恢復登入狀態');
    }
}

// 切換登入/註冊 Tab
window.switchAuthTab = function(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('authModalTitle');
    
    clearAuthErrors();
    
    if (tab === 'login') {
        loginTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
        loginTab.classList.remove('text-gray-500');
        registerTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
        registerTab.classList.add('text-gray-500');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        title.textContent = '登入系統';
    } else {
        registerTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
        registerTab.classList.remove('text-gray-500');
        loginTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
        loginTab.classList.add('text-gray-500');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        title.textContent = '註冊新帳號';
    }
}

// 密碼雜湊（SHA-256）
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 顯示認證錯誤
function showAuthError(type, message) {
    const errorEl = document.getElementById(`${type}Error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

// 顯示認證成功
function showAuthSuccess(type, message) {
    const successEl = document.getElementById(`${type}Success`);
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.remove('hidden');
    }
}

// 清除認證錯誤
function clearAuthErrors() {
    document.querySelectorAll('#loginError, #registerError, #registerSuccess').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}

// Toast 通知
function showToast(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// 登入後更新 UI
function updateUIAfterLogin() {
    const roleText = currentUser.role === 'admin' ? '管理員' : 
                     currentUser.role === 'member' ? '成員' : '待審核';
    const roleColor = currentUser.role === 'admin' ? 'text-purple-600' : 
                      currentUser.role === 'member' ? 'text-green-600' : 'text-gray-500';
    
    document.getElementById('userInfo').innerHTML = `
        <span class="text-gray-800 font-semibold">${currentUser.username}</span>
        <span class="text-xs ${roleColor} ml-1">${roleText}</span>
    `;
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    
    // 根據角色控制導航
    const myDataBtn = document.getElementById('myDataNavBtn');
    const statsViewBtn = document.getElementById('statsViewNavBtn');
    const adminBtn = document.getElementById('adminNavBtn');
    const usersBtn = document.getElementById('usersNavBtn');
    
    if (currentUser.role === 'admin') {
        // 管理員：所有功能
        if (myDataBtn) myDataBtn.style.display = 'flex';
        if (statsViewBtn) statsViewBtn.style.display = 'flex';
        if (adminBtn) adminBtn.style.display = 'flex';
        if (usersBtn) usersBtn.style.display = 'flex';
    } else if (currentUser.role === 'member') {
        // 成員：我的數據、看板、成員分析
        if (myDataBtn) myDataBtn.style.display = 'flex';
        if (statsViewBtn) statsViewBtn.style.display = 'flex';
        if (adminBtn) adminBtn.style.display = 'flex';
        if (usersBtn) usersBtn.style.display = 'none';
    } else {
        // viewer（待審核）：只能看首頁
        if (myDataBtn) myDataBtn.style.display = 'none';
        if (statsViewBtn) statsViewBtn.style.display = 'none';
        if (adminBtn) adminBtn.style.display = 'none';
        if (usersBtn) usersBtn.style.display = 'none';
    }
}

// 登出後更新 UI
function updateUIAfterLogout() {
    document.getElementById('userInfo').innerHTML = '<span class="text-gray-600">訪客</span>';
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    
    // 隱藏所有受保護的 tab
    const myDataBtn = document.getElementById('myDataNavBtn');
    const statsViewBtn = document.getElementById('statsViewNavBtn');
    const adminBtn = document.getElementById('adminNavBtn');
    const usersBtn = document.getElementById('usersNavBtn');
    
    if (myDataBtn) myDataBtn.style.display = 'none';
    if (statsViewBtn) statsViewBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    if (usersBtn) usersBtn.style.display = 'none';
    
    showPage('home');
}

// 載入看板數據 - 從 Supabase
async function loadStatsView() {
    if (!supabaseClient) {
        console.error('Supabase 未初始化');
        return;
    }
    
    try {
        const { data: allData, error } = await supabaseClient
            .from('combat_data')
            .select('*');
        
        if (error) {
            console.error('載入看板數據錯誤:', error);
            return;
        }
        
        console.log('看板數據:', allData);
        
        // 按角色類型分類
        const meleeData = (allData || []).filter(d => !d.character_type || d.character_type === 'melee');
        const mageData = (allData || []).filter(d => d.character_type === 'mage');
        const rangedData = (allData || []).filter(d => d.character_type === 'ranged');
        
        // 載入近戰排行榜
        loadMeleeRanking(meleeData);
    } catch (err) {
        console.error('載入看板錯誤:', err);
    }
}

// 切換看板 Tab
window.switchStatsTab = function(type) {
    // 更新 Tab 樣式
    document.querySelectorAll('.stats-type-tab').forEach(tab => {
        tab.classList.remove('active', 'text-purple-600', 'border-b-2', 'border-purple-600');
        tab.classList.add('text-gray-500');
    });
    
    const activeTab = document.getElementById(`statsTab-${type}`);
    if (activeTab) {
        activeTab.classList.add('active', 'text-purple-600', 'border-b-2', 'border-purple-600');
        activeTab.classList.remove('text-gray-500');
    }
    
    // 切換內容
    document.querySelectorAll('.stats-type-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const activeContent = document.getElementById(`statsContent-${type}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
}

// 近戰屬性列表
const MELEE_STATS = [
    // 基礎屬性
    '力量', '敏捷', '力量增加%數',
    // 攻擊屬性
    '近距離傷害', '近距離命中', '近距離爆擊',
    '機率附加傷害',
    // 速度屬性
    '攻擊速度', '移動速度',
    // 傷害增加
    '傷害增加', '決勝一擊', '決勝一擊增幅率',
    'PVP近距離附加傷害', 'PVP附加傷害', '爆擊時追加近距離傷害',
    // 無視類
    '無視傷害減免', '無視PVP傷害減免', '無視近距離傷害減免',
    '無視近距離迴避力', 'PVP無視近距離迴避力',
    '無視傷害減少', 'PVP傷害減少無視', '無視近距離傷害減少',
    // 防禦屬性
    '物理防禦力', '最大HP',
    // 傷害減免
    '傷害減免', 'PVP傷害減免', '爆擊傷害減免', '屬性傷害減免',
    '昏迷狀態傷害減免', '連續傷害減免', '疊加傷害減免',
    // 傷害減少
    '傷害減少', '減少近距離傷害', 'PVP傷害減少', '持續傷害減少',
    '破壞盔甲傷害減少', 'HP30%以下傷害量減少',
    // 迴避
    '近距離迴避力', 'PVP近距離迴避力',
    // 抗性
    '近距離爆擊抗性', '阻擋武器', '昏迷命中', '昏迷抗性',
    // 恢復
    '藥水恢復量', '藥水恢復率', '藥水冷卻時間減少'
];

// ===== 戰力計算權重系統 =====

// A. 生存力 (Survival) - 活著才有輸出
const SURVIVAL_WEIGHTS = {
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

// B. 輸出爆發 (Burst) - 造成傷害的基礎數值
const BURST_WEIGHTS = {
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

// C. 輸出效率 (Penetration) - 無視屬性，後期邊際效益不遞減
const PENETRATION_WEIGHTS = {
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

// D. PVP優勢 (PVP Specific)
const PVP_WEIGHTS = {
    'PVP近距離附加傷害': 3.0,
    'PVP附加傷害': 3.0
};

// 計算四大維度戰力分數
function calculateCombatPower(memberStats) {
    const scores = {
        survival: 0,      // 生存力
        burst: 0,         // 輸出爆發
        penetration: 0,   // 輸出效率
        pvp: 0,           // PVP優勢
        total: 0          // 總戰力
    };
    
    // 計算生存力分數
    Object.entries(SURVIVAL_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) {
            scores.survival += memberStats[stat].total * weight;
        }
    });
    
    // 計算輸出爆發分數
    Object.entries(BURST_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) {
            scores.burst += memberStats[stat].total * weight;
        }
    });
    
    // 計算輸出效率分數
    Object.entries(PENETRATION_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) {
            scores.penetration += memberStats[stat].total * weight;
        }
    });
    
    // 計算PVP優勢分數
    Object.entries(PVP_WEIGHTS).forEach(([stat, weight]) => {
        if (memberStats[stat]) {
            scores.pvp += memberStats[stat].total * weight;
        }
    });
    
    // 總戰力 = 四大維度加總
    scores.total = Math.floor(scores.survival + scores.burst + scores.penetration + scores.pvp);
    scores.survival = Math.floor(scores.survival);
    scores.burst = Math.floor(scores.burst);
    scores.penetration = Math.floor(scores.penetration);
    scores.pvp = Math.floor(scores.pvp);
    
    return scores;
}

// 載入近戰排行榜
function loadMeleeRanking(meleeData) {
    const container = document.getElementById('meleeRanking');
    if (!container) return;
    
    if (meleeData.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <span class="material-icons text-4xl mb-2">inbox</span>
                <p>尚無近戰角色數據</p>
            </div>
        `;
        return;
    }
    
    // 計算每個角色的戰力並排序
    const rankedData = meleeData.map(member => {
        const memberStats = calculateMemberStats(member);
        const combatPower = calculateCombatPower(memberStats);
        return { member, memberStats, combatPower };
    }).sort((a, b) => b.combatPower.total - a.combatPower.total);
    
    let html = '';
    rankedData.forEach((data, index) => {
        const { member, memberStats, combatPower } = data;
        const rank = index + 1;
        
        // 排名樣式
        let rankBgColor = 'bg-purple-600';
        if (rank === 1) rankBgColor = 'bg-yellow-500';
        else if (rank === 2) rankBgColor = 'bg-gray-400';
        else if (rank === 3) rankBgColor = 'bg-amber-600';
        
        html += `
            <div class="border rounded-lg overflow-hidden mb-3 shadow-sm">
                <div class="bg-purple-100 px-4 py-3 cursor-pointer hover:bg-purple-200 transition"
                     onclick="window.toggleMemberStats('member-stats-${index}')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="w-10 h-10 rounded-full ${rankBgColor} text-white flex items-center justify-center mr-3 font-bold text-lg">${rank}</span>
                            <div>
                                <span class="font-bold text-lg text-purple-800">${member.member_name || '未命名'}</span>
                                <span class="text-sm text-purple-600 ml-2">${member.member_class || ''}</span>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="text-right mr-4">
                                <div class="text-2xl font-bold text-purple-700">${combatPower.total.toLocaleString()}</div>
                                <div class="text-xs text-gray-500">總戰力</div>
                            </div>
                            <span class="material-icons text-purple-600" id="toggle-member-stats-${index}">expand_more</span>
                        </div>
                    </div>
                    
                    <!-- 四大維度分數條 -->
                    <div class="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                        <div class="bg-red-100 rounded p-2">
                            <div class="text-red-600 font-semibold">🛡️ 生存力</div>
                            <div class="text-red-700 font-bold text-lg">${combatPower.survival.toLocaleString()}</div>
                        </div>
                        <div class="bg-orange-100 rounded p-2">
                            <div class="text-orange-600 font-semibold">⚔️ 爆發力</div>
                            <div class="text-orange-700 font-bold text-lg">${combatPower.burst.toLocaleString()}</div>
                        </div>
                        <div class="bg-blue-100 rounded p-2">
                            <div class="text-blue-600 font-semibold">🎯 穿透力</div>
                            <div class="text-blue-700 font-bold text-lg">${combatPower.penetration.toLocaleString()}</div>
                        </div>
                        <div class="bg-purple-100 rounded p-2 border border-purple-200">
                            <div class="text-purple-600 font-semibold">👑 PVP</div>
                            <div class="text-purple-700 font-bold text-lg">${combatPower.pvp.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                <div id="member-stats-${index}" class="bg-white p-4" style="display: none;">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        ${MELEE_STATS.map((stat, statIndex) => {
                            const statValue = memberStats[stat] || { total: 0, sources: [] };
                            // 判斷屬性類別給予不同顏色
                            let statColor = 'text-gray-700';
                            let bgColor = '';
                            if (SURVIVAL_WEIGHTS[stat]) { statColor = 'text-red-600'; bgColor = 'bg-red-50'; }
                            else if (BURST_WEIGHTS[stat]) { statColor = 'text-orange-600'; bgColor = 'bg-orange-50'; }
                            else if (PENETRATION_WEIGHTS[stat]) { statColor = 'text-blue-600'; bgColor = 'bg-blue-50'; }
                            else if (PVP_WEIGHTS[stat]) { statColor = 'text-purple-600'; bgColor = 'bg-purple-50'; }
                            
                            return `
                                <div class="border rounded p-2 hover:bg-gray-50 cursor-pointer ${bgColor}"
                                     onclick="window.toggleStatDetail('stat-detail-${index}-${statIndex}')">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm ${statColor}">${stat}</span>
                                        <span class="font-bold ${statColor}">${statValue.total}</span>
                                    </div>
                                    <div id="stat-detail-${index}-${statIndex}" class="mt-2 text-xs bg-gray-50 p-2 rounded" style="display: none;">
                                        ${statValue.sources.length > 0 ? 
                                            statValue.sources.map(s => `
                                                <div class="flex justify-between py-1 border-b border-gray-200 last:border-0">
                                                    <span class="text-gray-600">${s.source}</span>
                                                    <span class="font-semibold ${s.value > 0 ? 'text-green-600' : 'text-gray-400'}">${s.value}</span>
                                                </div>
                                            `).join('') :
                                            '<div class="text-gray-400">無數據</div>'
                                        }
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 計算成員各屬性統計
function calculateMemberStats(member) {
    const stats = {};
    
    // 初始化所有屬性
    MELEE_STATS.forEach(stat => {
        stats[stat] = { total: 0, sources: [] };
    });
    
    // 模組名稱對照
    const moduleNames = {
        star: '守護星', pattern: '紋樣', item: '道具收藏', artifact: '聖物卡',
        doll: '魔法娃娃', transform: '變身卡', prof: '熟練度', elixir: '哈芙萬能藥'
    };
    
    // 裝備名稱對照
    const equipmentNames = {
        eq_helmet: '頭盔', eq_tshirt: 'T恤', eq_badge: '徽章', eq_shoulder: '肩甲',
        eq_weapon: '武器', eq_cloak: '斗篷', eq_armor: '盔甲', eq_armguard: '臂甲',
        eq_boots: '靴子', eq_gloves: '手套', eq_pants: '褲子', eq_earring1: '耳環1',
        eq_earring2: '耳環2', eq_belt: '腰帶', eq_necklace: '項鍊', eq_ring1: '戒指1',
        eq_ring2: '戒指2', eq_ring3: '戒指3', eq_ring4: '戒指4', eq_bracelet1: '手環1',
        eq_bracelet2: '手環2', eq_bracelet3: '手環3', eq_rune1: '符石1', eq_rune2: '符石2',
        eq_guard_seal: '守護印章', eq_recover_seal: '恢復印章', eq_crystal: '水晶', eq_catalyst: '催化石'
    };
    
    // 遍歷所有模組
    Object.keys(moduleNames).forEach(moduleKey => {
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
        Object.keys(equipmentNames).forEach(eqKey => {
            if (member.equipment[eqKey]) {
                const eqData = member.equipment[eqKey];
                const eqDisplayName = eqData['裝備名稱'] ? 
                    `${equipmentNames[eqKey]}(${eqData['裝備名稱']})` : 
                    equipmentNames[eqKey];
                    
                Object.entries(eqData).forEach(([field, value]) => {
                    if (field === '裝備名稱') return;
                    const numValue = parseFloat(value) || 0;
                    if (numValue > 0 && stats[field]) {
                        stats[field].total += numValue;
                        stats[field].sources.push({
                            source: eqDisplayName,
                            value: numValue
                        });
                    }
                });
            }
        });
    }
    
    return stats;
}

// 切換成員統計展開/折疊
window.toggleMemberStats = function(id) {
    const content = document.getElementById(id);
    const toggleIcon = document.getElementById(`toggle-${id}`);
    
    if (content) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            if (toggleIcon) toggleIcon.textContent = 'expand_less';
        } else {
            content.style.display = 'none';
            if (toggleIcon) toggleIcon.textContent = 'expand_more';
        }
    }
}

// 切換屬性詳情展開/折疊
window.toggleStatDetail = function(id) {
    const content = document.getElementById(id);
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
    event.stopPropagation();
}

// ===== 使用者管理功能 =====

// 載入使用者列表
window.loadUsersList = async function() {
    const tbody = document.getElementById('usersList');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">載入中...</td></tr>';
    
    if (!supabaseClient) {
        tbody.innerHTML = `
            <tr><td colspan="7" class="text-center py-8 text-gray-500">
                <span class="material-icons text-4xl mb-2">cloud_off</span>
                <p>目前為離線模式，無法載入用戶列表</p>
            </td></tr>
        `;
        return;
    }
    
    try {
        const { data: users, error } = await supabaseClient
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // 更新統計
        const total = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        const members = users.filter(u => u.role === 'member' && u.is_active).length;
        const inactive = users.filter(u => !u.is_active).length;
        
        document.getElementById('totalUsersCount').textContent = total;
        document.getElementById('adminUsersCount').textContent = admins;
        document.getElementById('memberUsersCount').textContent = members;
        document.getElementById('inactiveUsersCount').textContent = inactive;
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">尚無用戶</td></tr>';
            return;
        }
        
        let html = '';
        users.forEach(user => {
            const roleColors = {
                admin: 'bg-purple-100 text-purple-800',
                member: 'bg-blue-100 text-blue-800',
                viewer: 'bg-gray-100 text-gray-800'
            };
            const roleNames = {
                admin: '管理員',
                member: '成員',
                viewer: '檢視者'
            };
            
            html += `
                <tr class="border-b hover:bg-gray-50 ${!user.is_active ? 'opacity-50' : ''}">
                    <td class="py-3 px-4 text-sm">${user.email}</td>
                    <td class="py-3 px-4 font-semibold">${user.game_character_id}</td>
                    <td class="py-3 px-4 text-center">
                        <select onchange="updateUserRole('${user.id}', this.value)" 
                                class="text-sm rounded border px-2 py-1 ${roleColors[user.role]}">
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>管理員</option>
                            <option value="member" ${user.role === 'member' ? 'selected' : ''}>成員</option>
                            <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>檢視者</option>
                        </select>
                    </td>
                    <td class="py-3 px-4 text-center">
                        <span class="px-2 py-1 rounded text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${user.is_active ? '啟用' : '停用'}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-500">
                        ${user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-500">
                        ${user.last_login ? new Date(user.last_login).toLocaleString() : '從未登入'}
                    </td>
                    <td class="py-3 px-4 text-center">
                        <button onclick="toggleUserActive('${user.id}', ${!user.is_active})" 
                                class="text-sm px-3 py-1 rounded ${user.is_active ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}">
                            ${user.is_active ? '停用' : '啟用'}
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
    } catch (err) {
        console.error('載入用戶列表錯誤:', err);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-red-500">載入失敗：${err.message}</td></tr>`;
    }
}

// 更新用戶權限
window.updateUserRole = async function(userId, newRole) {
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient
            .from('users')
            .update({ role: newRole })
            .eq('id', userId);
        
        if (error) throw error;
        showToast('權限已更新', 'success');
    } catch (err) {
        console.error('更新權限錯誤:', err);
        showToast('更新失敗：' + err.message, 'error');
        loadUsersList(); // 重新載入還原狀態
    }
}

// 切換用戶啟用狀態
window.toggleUserActive = async function(userId, newStatus) {
    if (!supabaseClient) return;
    
    const action = newStatus ? '啟用' : '停用';
    if (!confirm(`確定要${action}此用戶？`)) return;
    
    try {
        const { error } = await supabaseClient
            .from('users')
            .update({ is_active: newStatus })
            .eq('id', userId);
        
        if (error) throw error;
        showToast(`用戶已${action}`, 'success');
        loadUsersList();
    } catch (err) {
        console.error('切換狀態錯誤:', err);
        showToast('操作失敗：' + err.message, 'error');
    }
}

// 頁面切換時載入用戶列表
document.addEventListener('DOMContentLoaded', function() {
    // 監聽使用者管理頁面
    const usersNavBtn = document.getElementById('usersNavBtn');
    if (usersNavBtn) {
        usersNavBtn.addEventListener('click', () => {
            setTimeout(loadUsersList, 100);
        });
    }
});
