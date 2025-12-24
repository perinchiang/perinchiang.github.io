// 获取Canvas和上下文
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置Canvas尺寸为全屏
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// 监听窗口resize事件，确保Canvas永远填满屏幕
window.addEventListener('resize', resizeCanvas);

// 粒子类定义
// 粒子类定义
class Particle {
    constructor() {
        // 初始化粒子位置 - 随机分布在Canvas内
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // 初始化速度 - 小的随机初始速度
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;

        // 随机HSL霓虹色
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;

        // 随机大小 - 1到4像素之间
        this.size = Math.random() * 3 + 1;
    }

    // 更新粒子物理状态 (保持原样，无需修改)
    update(mouseX, mouseY, mouseSpeed = 0) {
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                const baseForce = 4000 / (distance * distance);
                const speedBoost = mouseSpeed * 0.02; 
                const distanceBoost = Math.max(0.5, Math.min(2.0, 200 / distance));
                const force = Math.min(4.0, baseForce * (1 + speedBoost) + distanceBoost);

                const ax = normalizedDx * force;
                const ay = normalizedDy * force;

                this.vx += ax;
                this.vy += ay;
            }
        }

        const friction = mouseSpeed > 25 ? 0.9 : 0.98;
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    // 绘制粒子 (重点修改了这里 👇)
    draw(mouseX, mouseY) {
        let drawSize = this.size;
        
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 修改 1: 将感应范围从 80 扩大到 150，让变化更平滑
            const shrinkRadius = 150;

            if (distance < shrinkRadius) {
                // 计算距离比例 (0.0 表示在鼠标中心，1.0 表示在边缘)
                const ratio = distance / shrinkRadius;

                // 修改 2: 调整缩放逻辑
                // 最小尺寸变成 0.1 (10%)，之前是 0.25
                // 公式：最小比例 + (距离比例 * (1 - 最小比例))
                const minScale = 0.1; 
                const scaleFactor = minScale + ratio * (1 - minScale); 
                
                drawSize = this.size * scaleFactor;
            }
        }

        ctx.beginPath();
        // 保证最小至少有 0.5px，否则可能渲染不出来
        ctx.arc(this.x, this.y, Math.max(0.5, drawSize), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// 创建粒子数组并初始化800个粒子
const particles = [];
for (let i = 0; i < 800; i++) {
    particles.push(new Particle());
}

// 鼠标位置跟踪
let mouseX, mouseY;
let prevMouseX, prevMouseY;
let mouseSpeed = 0;

// 点击冲击波效果
let clickEffects = [];
// 点击计数器
let clickCount = 0;
// 烟花效果
let fireworks = [];
// 祝福文字显示时间
let messageStartTime = 0;


// 监听鼠标移动事件
canvas.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX || e.clientX;
    prevMouseY = mouseY || e.clientY;

    mouseX = e.clientX;
    mouseY = e.clientY;

    // 计算鼠标移动速度
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);
});


// 监听鼠标点击事件
canvas.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;

    // 增加点击计数
    clickCount++;

    // 创建点击冲击波效果（前19次）
    if (clickCount < 10) {
        clickEffects.push({
            x: clickX,
            y: clickY,
            radius: 0,
            maxRadius: 150,
            strength: 8,
            life: 30 // 冲击波持续帧数
        });

        // 立即给附近的粒子施加向外的推力
        particles.forEach(particle => {
            const dx = particle.x - clickX;
            const dy = particle.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 扩大影响范围到150像素，让更多粒子受到冲击
            if (distance < 150 && distance > 0) {
                // 距离越近，推力越强，增强推力强度
                const force = (150 - distance) / 150 * 25;
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;

                // 施加向外的推力
                particle.vx += normalizedDx * force;
                particle.vy += normalizedDy * force;
            }
        });
    }

    // 检查是否达10次点击 - 触发最终惊喜
    if (clickCount >= 10 && messageStartTime === 0) {
        messageStartTime = Date.now(); // 记录文字开始显示的时间

        // 创建盛大烟花秀
        for (let burst = 0; burst < 3; burst++) { // 3轮烟花爆发
            for (let i = 0; i < 80; i++) { // 每轮80个烟花粒子
                const angle = (Math.PI * 2 * i) / 80 + burst * Math.PI / 3;
                
                // 稍微减小一点初始爆发速度，配合慢速下落
                const speed = 8 + Math.random() * 12; 

                fireworks.push({
                    x: clickX + (Math.random() - 0.5) * 100,
                    y: clickY + (Math.random() - 0.5) * 100,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: `hsl(${Math.random() * 360}, 90%, 65%)`,
                    
                    // --- 关键修改开始 ---
                    
                    // 1. 延长寿命：因为下落变慢了，需要增加存活帧数 (原 80 -> 180)
                    life: 180 + Math.random() * 100, 
                    
                    size: 3 + Math.random() * 4,
                    
                    // 2. 降低重力：原 0.08 -> 0.035
                    // 越小，下落越慢，越有"失重感"
                    gravity: 0.035, 
                    
                    // 3. 增加空气阻力：原 0.985 -> 0.96
                    // 值越小，减速越快，最后会像羽毛一样慢慢飘
                    drag: 0.96 
                    
                    // --- 关键修改结束 ---
                });
            }
        }
    }
});


// 动画循环 - 使用requestAnimationFrame保证60fps流畅运行
function animate() {
    // 拖尾效果：不使用clearRect清除整个画布
    // 而是覆盖一层半透明黑色，实现渐隐拖尾效果
    // 物理原理：模拟光子的衰减，每帧减少10%的亮度
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新点击冲击波效果（前19次）
    for (let i = clickEffects.length - 1; i >= 0; i--) {
        const effect = clickEffects[i];
        effect.radius += 8; // 冲击波扩散速度
        effect.life--;

        // 绘制冲击波涟漪效果
        if (effect.life > 0) {
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${effect.life / 30 * 0.5})`; // 逐渐透明
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // 冲击波效果结束，移除
            clickEffects.splice(i, 1);
        }
    }

    // 更新烟花效果（第10次）
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        // 应用重力和空气阻力
        firework.vy += firework.gravity;
        firework.vx *= firework.drag;
        firework.vy *= firework.drag;

        // 更新位置
        firework.x += firework.vx;
        firework.y += firework.vy;

        // 减少生命周期
        firework.life--;

        // 绘制烟花粒子
        if (firework.life > 0) {
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            ctx.fillStyle = firework.color;
            ctx.fill();

            // 添加拖尾效果
            if (firework.life > 10) {
                ctx.beginPath();
                ctx.arc(firework.x - firework.vx * 2, firework.y - firework.vy * 2, firework.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = firework.color.replace('65%', '30%'); // 更透明的拖尾
                ctx.fill();
            }
        } else {
            // 烟花粒子生命周期结束，移除
            fireworks.splice(i, 1);
        }
    }

    // 更新并绘制所有粒子（在最终惊喜期间隐藏粒子，让烟花和祝福成为焦点）
    const isFinalSurprise = messageStartTime > 0;
    if (!isFinalSurprise) {
        particles.forEach(particle => {
            particle.update(mouseX, mouseY, mouseSpeed);
            particle.draw(mouseX, mouseY);
        });
    }

    // 检查是否达到10次点击，显示生日祝福（带渐变效果）
    if (messageStartTime > 0) {
        const elapsed = Date.now() - messageStartTime;
        const fadeInDuration = 2000; // 2秒渐变时间
        const alpha = Math.min(1, elapsed / fadeInDuration);

        if (alpha > 0) {
            // 保存当前绘图状态
            ctx.save();

            // --- 1. 字体升级 ---
            // 使用衬线体 (serif) 比 Arial 更有仪式感和高级感
            // 加上 italic (斜体) 增加动感
            ctx.font = 'bold italic 130px Georgia, "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = canvas.width / 2;
            const textY = canvas.height / 2;

            // --- 2. 创建高级感白金渐变 (核心!) ---
            // 创建一个垂直线性渐变，范围覆盖文字高度
            // 假设字号130px，我们上下各取80px范围做渐变
            const gradient = ctx.createLinearGradient(0, textY - 80, 0, textY + 80);

            // 定义渐变色标 (注意：所有颜色都要乘上 alpha 以实现淡入效果)
            // 0% (顶部): 极亮，带一点点冷色调的钻白色
            gradient.addColorStop(0, `rgba(240, 248, 255, ${alpha})`); 
            // 45% (中上): 纯粹的核心亮白
            gradient.addColorStop(0.45, `rgba(255, 255, 255, ${alpha})`);
            // 55% (中下): 依然是亮白，制造一个明亮的光带区域
            gradient.addColorStop(0.55, `rgba(255, 255, 255, ${alpha})`);
            // 100% (底部): 稍微暗一点的银灰色，增加金属厚重感和立体感
            gradient.addColorStop(1, `rgba(200, 210, 225, ${alpha})`);

            // 将设计好的渐变设置为填充样式
            ctx.fillStyle = gradient;

            // --- 3. 升级阴影为“圣光”效果 ---
            // 原来的黑色阴影太硬了。高级感需要柔和的发光。
            // 使用带点蓝紫色的高亮光晕，配合整体霓虹氛围
            ctx.shadowColor = `rgba(180, 210, 255, ${alpha})`; // 随文字淡入
            ctx.shadowBlur = 40; // 巨大的柔和光晕
            // 取消偏移，让光芒从中心向四周发散
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // 绘制文字 (为了增强发光感，我们可以画两次)
            // 第一次绘制：主要负责底层的强光晕
            ctx.fillText('谭怡姬生日快乐', textX, textY);
            
            // 第二次绘制：减小光晕，覆盖在上面，让文字主体更清晰锐利
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.fillText('谭怡姬生日快乐', textX, textY);


            // --- 4. 装饰小星星 (保持不变，略微调整颜色配合文字) ---
            const time = Date.now() * 0.005;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + time;
                const radius = 160; // 稍微扩大一点半径，避开大字体
                const x = canvas.width / 2 + Math.cos(angle) * radius;
                const y = canvas.height / 2 + Math.sin(angle) * radius;

                ctx.beginPath();
                // 让星星的颜色更偏向银白和浅蓝，配合文字
                const hue = (i * 45 + time * 50) % 360;
                ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${alpha})`;
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 15;
                // 星星也要用光叠加模式，更亮
                ctx.globalCompositeOperation = 'lighter';
                ctx.arc(x, y, 6 + Math.sin(time * 3 + i) * 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // 恢复绘图状态
            ctx.restore();
        }
    }

    // 请求下一帧动画
    requestAnimationFrame(animate);
}

// 开始动画循环
animate();
