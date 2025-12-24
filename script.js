// 鼠标跟随特效 (Mouse Trail) - 微交互粒子系统
class MouseTrail {
    constructor() {
        // 检查是否为移动端设备（屏幕宽度 < 768px）
        if (window.innerWidth < 768) {
            return; // 移动端不执行特效
        }

        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.maxParticles = 100; // 最大粒子数量
        this.isMouseMoving = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.init();
    }

    init() {
        // 创建 Canvas 元素
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.backgroundColor = 'transparent';

        // 设置 Canvas 大小
        this.resizeCanvas();
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // 绑定事件
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // 开始动画循环
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleMouseMove(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        // 只有当鼠标真正移动时才创建粒子
        if (Math.abs(currentX - this.lastMouseX) > 1 || Math.abs(currentY - this.lastMouseY) > 1) {
            this.createParticle(currentX, currentY);
            this.lastMouseX = currentX;
            this.lastMouseY = currentY;
        }
    }

    createParticle(x, y) {
        // 控制粒子总数
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // 移除最老的粒子
        }

        // 随机颜色：多彩低饱和度或半透明深灰色
        const colors = [
            'rgba(100, 149, 237, 0.6)', // 淡蓝
            'rgba(147, 112, 219, 0.5)', // 淡紫
            'rgba(255, 182, 193, 0.4)', // 淡粉
            'rgba(176, 196, 222, 0.5)', // 浅钢蓝
            'rgba(221, 160, 221, 0.4)', // 梅红
            'rgba(64, 64, 64, 0.3)'     // 半透明深灰色
        ];

        const particle = {
            x: x,
            y: y,
            radius: Math.random() * 2 + 2, // 2-4px 半径
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 2, // 随机小速度 (-1 到 1)
            vy: (Math.random() - 0.5) * 2,
            life: 1.0, // 生命周期 (1.0 到 0.0)
            maxLife: 1.0,
            shrinkRate: 0.02, // 缩小速度
            fadeRate: 0.015   // 淡化速度
        };

        this.particles.push(particle);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // 更新位置（轻微扩散）
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 更新生命周期
            particle.life -= particle.fadeRate;
            particle.radius -= particle.shrinkRate;

            // 移除死亡的粒子
            if (particle.life <= 0 || particle.radius <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

            // 根据生命周期调整透明度
            const alpha = particle.life;
            const color = particle.color.replace(/[\d\.]+\)$/g, `${alpha})`);

            this.ctx.fillStyle = color;
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new MouseTrail();
});
