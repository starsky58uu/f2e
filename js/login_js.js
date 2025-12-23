/* login2_js.js - 高擬真血滴特效 + 故事跳轉 */

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
    const numDrops = 300; // 血滴數量

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

    // 重置單顆血滴
    function resetDrop(index) {
        drops[index] = {
            x: Math.random() * width,
            y: Math.random() * -height,
            radius: Math.random() * 3 + 2,
            speed: Math.random() * 5 + 2,
            colorBase: Math.random() > 0.5 ? [180, 0, 0] : [139, 0, 0], 
            opacity: Math.random() * 0.5 + 0.5
        };
    }

    // 繪圖循環
    function draw() {
        // 拖尾特效
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        drops.forEach((drop, i) => {
            drop.y += drop.speed;
            drop.speed += 0.05;

            if (drop.y > height + drop.radius * 10) {
                resetDrop(i);
            }

            ctx.beginPath();
            let stretchY = 1 + drop.speed / 20; 
            
            ctx.save();
            ctx.translate(drop.x, drop.y);
            ctx.scale(1, stretchY); 

            let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, drop.radius);
            gradient.addColorStop(0, `rgba(255, 50, 50, ${drop.opacity})`);
            gradient.addColorStop(0.6, `rgba(${drop.colorBase[0]}, ${drop.colorBase[1]}, ${drop.colorBase[2]}, ${drop.opacity})`);
            gradient.addColorStop(1, `rgba(50, 0, 0, ${drop.opacity * 0.5})`);

            ctx.fillStyle = gradient;
            ctx.arc(0, 0, drop.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        requestAnimationFrame(draw);
    }

    // 啟動 Canvas
    window.addEventListener('resize', resize);
    resize();
    draw();


    // ============================================
    // Part 2: 頁面內容顯示控制 (★您原本漏掉這段★)
    // ============================================
    
    // 設定 1.5 秒後，移除隱藏樣式，讓登入框浮現
    setTimeout(() => {
        // 抓取所有被隱藏的元素 (Header, Card, Link)
        document.querySelectorAll('.hidden').forEach(el => {
            el.classList.remove('hidden'); // 移除隱藏 class
            el.classList.add('show');      // 加上顯示 class (觸發 CSS transition)
        });
    }, 1500);


    // ============================================
    // Part 3: 表單提交與故事跳轉
    // ============================================
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const user = document.getElementById('user').value.trim();
            const pwd = document.getElementById('password').value;
            
            if (!user || !pwd) {
                alert('請輸入完整資訊...'); 
                return;
            }

            // 成功登入，提示並跳轉
            alert('儀式開始... 歡迎來到裏世界。'); 
            
            // 延遲 1 秒跳轉到故事頁
            setTimeout(() => {
                window.location.href = 'story.html'; 
            }, 1000);
        });
    }
});