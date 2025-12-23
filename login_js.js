/* login2_js.js - 高擬真血滴特效 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Part 1: Canvas 高擬真血流特效
    // ============================================
    const canvas = document.getElementById('bloodCanvas');
    if (!canvas) {
        console.error("找不到 bloodCanvas");
        return;
    }
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let drops = [];
    // 血滴數量：越多越密集，但效能消耗也越大 (建議 200-400)
    const numDrops = 300; 

    // 初始化畫布尺寸
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initDrops();
    }

    // 初始化血滴陣列
    function initDrops() {
        drops = [];
        for (let i = 0; i < numDrops; i++) {
            resetDrop(i);
        }
    }

    // 重置單顆血滴的狀態 (當它流出畫面後重新從上面開始)
    function resetDrop(index) {
        drops[index] = {
            x: Math.random() * width, // 隨機水平位置
            y: Math.random() * -height, // 隨機起始高度 (負數表示在螢幕上方)
            radius: Math.random() * 3 + 2, // 半徑大小 (2px ~ 5px)
            speed: Math.random() * 5 + 2,  // 初始速度
            // 顏色：使用深紅到鮮紅的隨機色
            colorBase: Math.random() > 0.5 ? [180, 0, 0] : [139, 0, 0], 
            opacity: Math.random() * 0.5 + 0.5 // 透明度 (讓有些血滴看起來比較稀)
        };
    }

    // 繪圖循環核心
    function draw() {
        // ★關鍵技巧：製造拖尾痕跡
        // 不完全清除畫布，而是蓋上一層半透明的黑色。
        // 這會讓上一幀的血滴變淡，形成自然的拖尾。
        // 0.1 的透明度越低，拖尾越長；越高，拖尾越短。
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        // 繪製每一顆血滴
        drops.forEach((drop, i) => {
            // 1. 計算物理
            drop.y += drop.speed;
            drop.speed += 0.05; // 重力加速度 (模擬黏稠感，加速不用太快)

            // 如果超出螢幕底部，重置到頂部
            if (drop.y > height + drop.radius * 10) {
                resetDrop(i);
            }

            // 2. 繪製血滴 (使用徑向漸層製造立體感)
            ctx.beginPath();
            // 根據速度拉伸血滴形狀 (速度越快，Y軸拉越長)
            let stretchY = 1 + drop.speed / 20; 
            
            // 儲存當前畫布狀態
            ctx.save();
            // 移動到血滴位置並進行拉伸變形
            ctx.translate(drop.x, drop.y);
            ctx.scale(1, stretchY); 

            // 創建徑向漸層 (中心亮紅 -> 邊緣深紅)
            let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, drop.radius);
            gradient.addColorStop(0, `rgba(255, 50, 50, ${drop.opacity})`); // 中心高光
            gradient.addColorStop(0.6, `rgba(${drop.colorBase[0]}, ${drop.colorBase[1]}, ${drop.colorBase[2]}, ${drop.opacity})`); // 中間血色
            gradient.addColorStop(1, `rgba(50, 0, 0, ${drop.opacity * 0.5})`); // 邊緣暗色

            ctx.fillStyle = gradient;
            ctx.arc(0, 0, drop.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 還原畫布狀態
            ctx.restore();
        });
        
        requestAnimationFrame(draw);
    }

    // 啟動
    window.addEventListener('resize', resize);
    resize();
    draw();

    // ============================================
    // Part 2: 頁面內容顯示控制 (維持不變)
    // ============================================
    
    // 1.5秒後，CSS動畫會讓血幕淡出，這裡負責讓底下的內容浮現
    setTimeout(() => {
        document.querySelectorAll('.login-header, .login-card, .back-link-container').forEach(el => {
            // 移除預設的隱藏樣式，套用 CSS 定義的動畫
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 1500);

    // 表單提交事件 (示範用)
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('儀式開始... (登入成功)');
        });
    }
});