/* story_js.js - 隨機選項版互動小說引擎 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 遊戲狀態管理 ---
    let gameState = {
        chapter: 'prologue',
        san: 100,            
        pain: 0,             
        hasNote: false,      
        inventory: []        
    };

    // --- 2. 劇本數據 ---
    const storyData = {
        // ==========================================
        // 【序章：禁忌的午睡】
        // ==========================================
        'prologue': {
            text: "午後的陽光肆無忌憚地灑落在白日夢樂園的長椅上，曬得人渾身酥軟。四周是歡快的遊樂園音樂與孩童的嬉鬧聲。<br><br>雖然腦海深處隱約記得入園須知上那條鮮紅色的警告——『園區內嚴禁睡眠』，但眼皮卻像灌了鉛一樣沉重，意識逐漸模糊……",
            speaker: "旁白",
            bg: "scene-normal",
            choices: [
                { text: "掙扎著去買杯咖啡提神", next: 'end0' },
                { text: "不管了，就瞇十分鐘", next: 'chapter1_transition' }
            ]
        },
        'end0': {
            text: "你猛地掐了一下大腿，強打精神走向販賣部買了杯黑咖啡。苦澀的液體滑入喉嚨，讓你瞬間清醒。<br><br>這只是一個普通的下午，什麼事也沒發生。你度過了平庸的一天，回家後在 Google 評論區憤怒地留下了一顆星：『咖啡賣得太貴了。』",
            speaker: "結局 0: 平庸的生還者",
            bg: "scene-normal",
            choices: [
                { text: "重新開始", action: () => location.reload() },
                { text: "回到遊樂園 (正常世界)", action: () => window.location.href = 'index.html' } 
            ]
        },

        // ==========================================
        // 【第一章：紅色的天空與官方通告】
        // ==========================================
        'chapter1_transition': {
            text: "你最終還是抵擋不住睡意，閉上了眼睛……<br><br>不知過了多久，原本嘈雜的人聲像是被切斷電源般，瞬間消失了。取而代之的，是死一般的寂靜，以及遠處傳來若有似無的電流滋滋聲。",
            speaker: "系統",
            bg: "scene-horror",
            effect: () => {
                updateStat('san', -5); 
            },
            choices: [
                { text: "睜開眼睛，觀察四周", next: 'chapter1_start' }
            ]
        },
        'chapter1_start': {
            text: "你猛然驚醒。天空不再是蔚藍色，而是呈現出一種病態的暗紅色，彷彿凝固的血塊。空氣中飄散著灰白色的絮狀物，聞起來像是燒焦的蛋白質……那是骨灰的味道。<br><br>原本光鮮亮麗的設施變得鏽跡斑斑，遊客全部消失了。此時，你的口袋裡突然感到一陣發燙，憑空多出了一張精緻的卡片。",
            speaker: "環境",
            bg: "scene-horror",
            effect: () => {
                addItem('D-666 管理條例'); 
            },
            choices: [
                { text: "閱讀卡片內容", next: 'chapter1_read_rules' }
            ]
        },
        'chapter1_read_rules': {
            text: "<b>【D-666 滯留區生態管理條例】</b><br><br>1. 請享受灰燼的味道，這有助於您適應環境。<br>2. 絕對不要製造「痛覺」，那是違禁品。<br>3. 不要試圖逃跑，出口並不存在。<br><br>讀完條例，你感到喉嚨一陣乾渴，肺部因渾濁的空氣而刺痛。左手邊有一台閃爍著詭異霓虹光的販賣機；右手邊，一個生鏽的通風口正發出「咯吱……咯吱……」的怪聲。",
            speaker: "物品",
            bg: "scene-horror",
            choices: [
                { text: "去販賣機買水", next: 'chapter2_official_route' },
                { text: "檢查發出怪聲的通風口", next: 'get_note' }
            ]
        },

        // --- 支線：獲得前輩字條 ---
        'get_note': {
            text: "你強忍著胃裡的翻騰，匍匐爬進狹窄陰暗的通風口。盡頭蜷縮著一具乾屍，枯槁的手指死死攥著一條染血的繃帶。<br><br>你掰開它的手指，發現繃帶背面寫著潦草而絕望的字跡……",
            speaker: "發現",
            bg: "scene-horror",
            effect: () => {
                gameState.hasNote = true; 
                addItem('前輩的字條');
                updateStat('san', -5); 
            },
            choices: [
                { text: "閱讀染血的字跡", next: 'read_senior_note' }
            ]
        },
        'read_senior_note': {
            text: "『別信規則！灰燼是死人的骨灰……痛覺是唯一的鑰匙……絕對不要相信那個無臉醫生……』<br><br>你看著這行字，雖然恐懼讓手指顫抖，但直覺告訴你，這或許才是這裡的真相。",
            speaker: "前輩的字條",
            bg: "scene-horror",
            choices: [
                { text: "離開通風口", next: 'chapter2_senior_route_start' }
            ]
        },

        // ==========================================
        // 【第二章：規則的衝突 (恐龍遭遇戰)】
        // ==========================================
        
        // === 路線 A: 沒有字條 (聽從官方) ===
        'chapter2_official_route': {
            text: "你按下販賣機按鈕，一罐鮮紅色的飲料滾了出來。你大口喝下，一股奇異的甜味瞬間衝上腦門。<br><br>恐懼感消失了，你甚至覺得空氣中的骨灰味變得香甜可口。你的嘴角不自覺地上揚，內心充滿了不自然的平靜。",
            speaker: "狀態更新",
            bg: "scene-horror",
            effect: () => {
                gameState.san = 100; 
                updateUI();
                triggerGlitch(); 
            },
            choices: [
                { text: "繼續向前走", next: 'chapter2_dino_encounter_A' }
            ]
        },
        'chapter2_dino_encounter_A': {
            text: "地面開始震動，一隻表皮潰爛、露出森森白骨的暴龍轉角衝了出來！<br><br>它張開血盆大口，噴出腐蝕性的氣體。但在喝了飲料的你眼中，那不過是遊樂園裡逼真的 3D 特效罷了。你呆呆地看著它，甚至想伸手觸摸……",
            speaker: "遭遇",
            bg: "scene-horror",
            choices: [
                { text: "站在原地欣賞特效", next: 'end1' }, 
                { text: "本能地尖叫逃跑", next: 'chapter3_start' } 
            ]
        },

        // === 路線 B: 有字條 (聽從前輩) ===
        'chapter2_senior_route_start': {
            text: "回到走廊，空氣中的灰燼愈發濃重，讓你意識逐漸模糊。你想起字條上的警告：『灰燼是骨灰，吸多了會忘記自己是誰』。<br><br>你必須做點什麼來保持清醒。",
            speaker: "思考",
            bg: "scene-horror",
            choices: [
                { text: "用尿液弄濕衣服掩住口鼻", next: 'chapter2_urine_mask' } 
            ]
        },
        'chapter2_urine_mask': {
            text: "這是一個艱難的決定。但為了活命，你照做了。尿液的騷味與羞恥感像一記耳光，讓你混亂的大腦瞬間清醒過來。",
            speaker: "行動",
            bg: "scene-horror",
            effect: () => {
                updateStat('pain', 10); 
            },
            choices: [
                { text: "遭遇襲擊！", next: 'chapter2_dino_encounter_B' }
            ]
        },
        'chapter2_dino_encounter_B': {
            text: "轟——！牆壁被撞破，一隻腐爛的暴龍衝了出來！它沒有眼球的眼窩正對著你，鼻孔噴著酸氣。<br><br>字條上寫著：『恐龍是瞎子，看不見靜止物體』……",
            speaker: "遭遇",
            bg: "scene-horror",
            choices: [
                { text: "拔腿狂奔", next: 'end1' }, 
                { text: "原地趴下裝死", next: 'chapter2_play_dead' } 
            ]
        },
        'chapter2_play_dead': {
            text: "你立刻趴在充滿灰燼的地上一動不動。暴龍低下來嗅探，強酸口水滴在你的背上，皮膚被灼燒的劇痛讓你差點慘叫出聲！<br><br>你死死咬破嘴唇，硬生生將慘叫嚥了回去。幾秒鐘後，暴龍以為你是死物，轉身離開了。",
            speaker: "檢定成功",
            bg: "scene-horror",
            effect: () => {
                updateStat('pain', 30); 
            },
            choices: [
                { text: "忍痛爬起，進入下一區", next: 'chapter3_start' }
            ]
        },

        // ==========================================
        // 【結局 1: 盲目的飼料】
        // ==========================================
        'end1': {
            text: "你以為那是特效，或者你高估了自己的速度。<br><br>伴隨著骨骼碎裂的聲音，你的視角旋轉了 180 度——你看到了自己無頭的軀體倒在地上。你的意識陷入了永恆的黑暗……",
            speaker: "BAD END: 盲目的飼料",
            bg: "scene-horror",
            choices: [
                { text: "重新挑戰", action: () => location.reload() },
                { text: "回到遊樂園 (入口)", action: () => window.location.href = 'index2.html' }
            ]
        },

        // ==========================================
        // 【第三章：甜蜜的陷阱與無臉醫生】
        // ==========================================
        'chapter3_start': {
            text: "你踉蹌著逃到了休息區。路邊的攤位上擺滿了香氣四溢的紅肉，但仔細一看，那肉塊上竟然還殘留著人類的指紋。<br><br>這時，一個穿著白大褂的身影向你走來。他的臉部是一片光滑的皮膚，沒有五官。「你看起來很焦慮，也受傷了。讓我幫你治療，再吃點東西吧？」",
            speaker: "無臉醫生",
            bg: "scene-horror",
            choices: [
                { text: "接受治療並吃肉", next: 'end2' }, 
                { text: "拒絕並製造痛覺", next: 'chapter3_self_harm_check' } 
            ]
        },

        // ==========================================
        // 【結局 2: 快樂的盆栽】
        // ==========================================
        'end2': {
            text: "你點了點頭。醫生溫柔地切斷了你的神經，痛楚瞬間消失了。你大口吃著肉塊，覺得無比美味。<br><br>世界變得美好，天空變回了藍色。你感覺雙腳生根，變成了園區裡一棵修剪整齊的裝飾樹，臉上掛著永遠無法卸下的微笑。",
            speaker: "BAD END: 快樂的盆栽",
            bg: "scene-normal",
            choices: [
                { text: "重新挑戰", action: () => location.reload() },
                { text: "回到遊樂園 (入口)", action: () => window.location.href = 'index2.html' }
            ]
        },

        // --- 痛覺檢定/製造 ---
        'chapter3_self_harm_check': {
            text: "不能接受！這是陷阱！一旦失去痛覺，你就真的變成这里的居民了！<br>你需要強烈的痛楚來讓自己保持清醒！桌上有一把生鏽的餐刀……<br><br><b>【QTE】快！刺下去！</b>",
            speaker: "覺醒",
            bg: "scene-horror",
            choices: [
                { text: "狠狠刺向大腿！！！", next: 'chapter3_success' } 
            ]
        },
        'chapter3_success': {
            text: "噗哧——！<br><br>餐刀沒入大腿，鮮血噴湧而出。劇烈的疼痛像電流一樣貫穿全身，讓你眼前的幻象瞬間破碎！<br>無臉醫生停下了腳步，因為檢測不到你的「順從」，判定你為不可回收的廢棄物，轉身機械地離開了。",
            speaker: "存活",
            bg: "scene-horror",
            effect: () => {
                updateStat('pain', 40); 
                triggerGlitch(); 
            },
            choices: [
                { text: "大口喘息，等待下一步", next: 'chapter4_start' }
            ]
        },

        // ==========================================
        // 【第四章：大清洗警報】
        // ==========================================
        'chapter4_start': {
            text: "突然，淒厲的防空警報聲響徹雲霄！<br>廣播傳來無機質的聲音：「系統緩存清理開始，請所有滯留者原地待命（等待刪除）。」<br><br>遠處，一道接天連地的白色毀滅光束正像掃描儀一樣，緩緩向你推進，所過之處萬物湮滅。",
            speaker: "系統廣播",
            bg: "scene-horror",
            choices: [
                { text: "呆站在原地", next: 'end3' }, 
                { text: "尋找掩護", next: 'chapter4_decision' }
            ]
        },
        'chapter4_decision': {
            autoRedirect: true,
            check: () => {
                if (gameState.hasNote) return 'chapter4_hide_corpse'; // 有字條才知道躲屍體
                else return 'end3'; // 沒字條，亂跑也是死
            }
        },
        'chapter4_hide_corpse': {
            text: "你想起字條上的話：『警報即會死亡……躲進屍體堆下面！』<br><br>你顧不得噁心，瘋狂地鑽進旁邊一堆發臭的殘肢斷臂中。白色的光束從頭頂掃過，那一瞬間，你聽見了周圍無數靈魂被刪除的慘叫聲……但你活下來了。",
            speaker: "僥倖",
            bg: "scene-horror",
            choices: [
                { text: "前往最終廣場", next: 'chapter5_start' }
            ]
        },

        // ==========================================
        // 【結局 3: 格式化】
        // ==========================================
        'end3': {
            text: "你不知道發生了什麼，或者你躲錯了地方。<br><br>白光掃過你的身體。沒有痛苦，沒有聲音。你的身體在一瞬間分解成了無數綠色的二進制代碼，飄散在虛擬的風中。",
            speaker: "BAD END: 格式化",
            bg: "scene-horror",
            choices: [
                { text: "重新挑戰", action: () => location.reload() },
                { text: "回到遊樂園 (入口)", action: () => window.location.href = 'index2.html' }
            ]
        },

        // ==========================================
        // 【最終章：暴龍的嘴】
        // ==========================================
        'chapter5_start': {
            text: "清洗過後，樂園中央的廣場出現了一隻巨大的、胸口發光的紫色暴龍。它的嘴裡不是喉嚨，而是一個瘋狂旋轉的數據漩渦。<br><br>官方規則說：『那是暴食之神，會吞噬靈魂』。<br>前輩字條說：『那是系統漏洞，唯一的出口』。<br><br>你現在傷痕累累，劇痛纏身，這是最後的機會。",
            speaker: "最終抉擇",
            bg: "scene-horror",
            choices: [
                { text: "猶豫，不敢靠近", next: 'end4' }, 
                { text: "衝進龍嘴", next: 'check_pain_for_true_end' } 
            ]
        },

        // --- 痛覺檢定 ---
        'check_pain_for_true_end': {
            autoRedirect: true,
            check: () => {
                // PDF 說 >80，計算：尿布(+10) + 裝死(+30) + 自殘(+40) = 80。
                if (gameState.pain >= 80) return 'true_end'; 
                else return 'end4_fail'; // 痛覺不夠
            }
        },

        // ==========================================
        // 【結局 4: 第N號前輩】
        // ==========================================
        'end4': {
            text: "看著那可怕的漩渦，你退縮了。你不敢跳。<br><br>紫色暴龍閉上了嘴，大門消失了。你活了下來，但永遠被留在了裏世界。日復一日，你開始習慣這裡的灰燼味。<br>幾年後，你在一張繃帶上寫下了新的字條，成為了下一個無助的『前輩』……",
            speaker: "NORMAL END: 第N號前輩",
            bg: "scene-horror",
            choices: [
                { text: "重新挑戰", action: () => location.reload() },
                { text: "回到遊樂園 (入口)", action: () => window.location.href = 'index2.html' }
            ]
        },
        'end4_fail': {
            text: "你試圖衝進去，但身上的傷口還不夠痛。你的身體本能地抗拒自殺般的行為，雙腳像生了根一樣動彈不得。<br><br>你只能眼睜睜看著暴龍閉上了嘴，出口永遠關閉了……",
            speaker: "結局",
            bg: "scene-horror",
            choices: [
                { text: "重新挑戰", action: () => location.reload() },
                { text: "回到遊樂園 (入口)", action: () => window.location.href = 'index2.html' }
            ]
        },

        // ==========================================
        // 【真結局: 夢醒時分】
        // ==========================================
        'true_end': {
            text: "「啊啊啊啊啊！」你發出撕心裂肺的吼叫，帶著全身的劇痛，義無反顧地衝進了數據漩渦！<br><br>劇烈的數據亂流像絞肉機一樣撕裂你的神經！<br><b>ERROR: SUBJECT UNSTABLE. EJECTING...</b><br><br>……嗶……嗶……嗶……<br><br>你猛地從病床上彈起，全身大汗淋漓。醫生衝進來驚呼：「奇蹟！植物人甦醒了！」<br>窗外是正常的、刺眼的藍天。但在床頭櫃上，放著一張遊樂園的宣傳單，那隻綠色恐龍正對著你，露出意味深長的微笑。",
            speaker: "TRUE END: 夢醒時分",
            bg: "scene-normal",
            effect: () => {
                // 可以在這裡加入勝利音效
            },
            choices: [
                { text: "感謝遊玩", action: () => alert("恭喜通關！你成功逃離了白日夢樂園。") },
                // 真結局回到正常世界首頁
                { text: "回到遊樂園 (正常世界)", action: () => window.location.href = 'index.html' } 
            ]
        }
    };

    // ==========================================
    // 3. 遊戲引擎核心 (Game Engine)
    // ==========================================
    const ui = {
        text: document.getElementById('story-text'),
        speaker: document.getElementById('speaker'),
        choices: document.getElementById('choices'),
        bg: document.getElementById('game-container'),
        sanBar: document.getElementById('san-bar'),
        painBar: document.getElementById('pain-bar'),
        inventory: document.getElementById('inventory-list'),
        glitch: document.getElementById('glitch-overlay')
    };

    function startGame() {
        renderScene('prologue');
    }

    function renderScene(sceneId) {
        const scene = storyData[sceneId];
        
        if (scene.autoRedirect) {
            const nextScene = scene.check();
            renderScene(nextScene);
            return;
        }

        if (scene.effect) {
            scene.effect();
        }

        ui.bg.className = scene.bg;

        ui.text.innerHTML = '';
        ui.text.classList.add('typing-cursor');
        
        ui.text.innerHTML = scene.text;
        ui.text.classList.remove('typing-cursor');

        ui.speaker.innerText = scene.speaker;

        showChoices(scene.choices);
    }

    // ★ 修改處：加入隨機洗牌邏輯
    function showChoices(choices) {
        ui.choices.innerHTML = ''; 
        
        // 1. 建立一個副本以免修改到原始數據
        let shuffledChoices = [...choices];

        // 2. 隨機打亂陣列 (Fisher-Yates Shuffle)
        // 注意：這裡我加了一個判斷，如果是「結局頁面」(有 '回到遊樂園' 選項的)，建議不要打亂，
        // 但既然您說要「隨機答案」，我就一視同仁全部打亂，或者我們可以保留「回到首頁」在最後。
        // 為了符合您「答案不要都是第二個」的需求，我們只打亂那些「有 next 屬性」的選項(即劇情選項)。
        // 結局按鈕通常是 action，我們可以不打亂結局按鈕，讓它保持整齊。
        
        const isGameplayChoice = shuffledChoices.some(c => c.next); 
        
        if (isGameplayChoice) {
            for (let i = shuffledChoices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
            }
        }

        // 3. 渲染按鈕
        shuffledChoices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice.text; 
            btn.onclick = () => {
                if (choice.action) {
                    choice.action(); 
                } else {
                    renderScene(choice.next); 
                }
            };
            ui.choices.appendChild(btn);
        });
    }

    window.updateStat = function(type, value) {
        if (type === 'san') gameState.san = Math.max(0, Math.min(100, gameState.san + value));
        if (type === 'pain') gameState.pain = Math.max(0, Math.min(100, gameState.pain + value));
        updateUI();
    };

    window.addItem = function(item) {
        if (!gameState.inventory.includes(item)) {
            gameState.inventory.push(item);
            updateUI();
        }
    };

    window.triggerGlitch = function() {
        if(ui.glitch) {
            ui.glitch.classList.add('glitch-active');
            setTimeout(() => ui.glitch.classList.remove('glitch-active'), 500);
        }
    }

    function updateUI() {
        if(ui.sanBar) ui.sanBar.style.width = gameState.san + '%';
        if(ui.painBar) ui.painBar.style.width = gameState.pain + '%';
        if(ui.inventory) ui.inventory.innerText = gameState.inventory.length > 0 ? gameState.inventory.join(', ') : '無';
    }

    startGame();
});