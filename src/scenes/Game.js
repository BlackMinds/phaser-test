import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');

        this.geeks = null; // Group for monsters
        this.player = null; // Player reference
        this.time = null
        this.healthBar = null;
    }

    preload() {
        // 加载背景图像
        this.load.image('background', 'assets/background.png');
        this.load.image('bullets', 'assets/zidan.png');

        // 加载角色精灵表
        this.load.spritesheet('character', 
            'assets/rw.png',  // 替换为你实际的角色精灵表路径
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('gw', 
            'assets/gw.png',  // 替换为你实际的角色精灵表路径
            { frameWidth: 83, frameHeight: 83 }
        );
    }

    create() {
        // 设置背景颜色
        this.cameras.main.setBackgroundColor(0x00ff00);

        // 添加背景图像
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // 创建玩家角色并设置物理属性
        this.player = this.physics.add.sprite(512, 384, 'character');


        // 设置角色的锚点为中心
        this.player.setOrigin(1, 1); // 根据精灵的实际形状进行调整

        // 设置世界的重力
        this.physics.world.gravity.y = 0; // 移除垂直重力，允许玩家在四个方向上自由移动

        // 设置玩家的物理属性
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.healthBar = new HealthBar(this, this.player.getBounds().x, this.player.getBounds().y, 50, 5);


        // Initialize monsters
        this.geeks = this.physics.add.group({
            key: 'gw',
            repeat: 10,
            setXY: { x: 50, y: 150, stepX: 80 }
        });
        
        this.geeks.children.iterate((monster) => {
            // Set health bar above each monster
            monster.healthBar = new geeksHealthBar(this, monster.x, monster.y - 60, 50, 5);
    
            if (monster.healthBar.currentHealth <= 0) {
                monster.destroy();
            }
        });

        // 添加碰撞检测
        this.physics.add.overlap(this.player, this.geeks, collectStar, null, this);

        function collectStar (player, geeks){
            geeks.healthBar.decrease(1);
            this.healthBar.decrease(1);
        }

        // 创建向左、向右的行走动画
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        // 创建向上、向下的行走动画
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 13, end: 16 }),  // 假设向上动画在帧 9-12
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 1, end: 4 }),  // 假设向下动画在帧 13-16
            frameRate: 10,
            repeat: -1
        });

        // 创建站立动画
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'character', frame: 1 }],
            frameRate: 20
        });

        // 设置键盘输入
        this.cursors = this.input.keyboard.createCursorKeys();


        this.bullets = this.physics.add.group({
            defaultKey: 'bullets',
            maxSize: 110 // 设置最大子弹数
        });

        this.physics.add.collider(this.bullets, this.geeks, (bullet, monster) => {
            if (bullet.active && monster.active) {
                // 击中怪物后禁用子弹，确保只击中一个怪物
                bullet.disableBody(true, true);
                monster.healthBar.decrease(9); // 假设子弹命中怪物时减少20点血量
    
                // 如果怪物的生命值降至0，销毁怪物
                if (monster.healthBar.currentHealth <= 0) {
                    monster.disableBody(true, true); // 隐藏并禁用怪物
                    monster.healthBar.healthBar.destroy(); // 移除怪物的血条
                }
            }
        });
    
    }
    shootBullet() {
        // 获取离玩家最近的怪物
        let closestMonster = null;
        let closestDistance = Infinity;
    
        this.geeks.children.iterate((monster) => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monster.x, monster.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestMonster = monster;
            }
        });
    
        if (closestMonster) {
            const bullet = this.bullets.get();
            
            if (bullet) {
                // 初始化子弹的状态
                bullet.enableBody(true, this.player.x, this.player.y, true, true);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setPosition(this.player.x, this.player.y);
                
                   // 缩小子弹大小
                bullet.setScale(0.5); // 根据需要调整缩小比例
                

                // 计算子弹的旋转角度
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, closestMonster.x, closestMonster.y);
                bullet.setRotation(angle); // 旋转子弹头朝向目标
                // 确保子弹的速度和方向
                this.physics.moveToObject(bullet, closestMonster, 200); // 子弹速度为300
    
                // 子弹的边界检测
                bullet.body.setCollideWorldBounds(true);
                bullet.body.onWorldBounds = true;
                bullet.body.world.on('worldbounds', (body) => {
                    if (body.gameObject === bullet) {
                        bullet.disableBody(true, true); // 子弹出界后禁用
                    }
                });
            }
        }
    }

    update() {
        // 初始化速度为 0
        this.player.setVelocity(0);

        // 检测键盘输入并控制玩家移动
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
        }

        // 如果没有按任何键，保持角色静止
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && 
            !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.anims.play('turn');  // 使用站立动画
        }
        this.healthBar.updatePosition(this.player.getBounds().x, this.player.getBounds().y);

        this.geeks.children.iterate((monster) => {
            this.physics.moveToObject(monster, this.player, 100); // 10为移动速度
            monster.healthBar.updatePosition(monster.x, monster.y - 60);
        });

         // 按空格键发射子弹
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            this.shootBullet();
        }
    }
}



// 血条
class HealthBar {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;

        // Create a graphics object to display the health bar
        this.bar = this.scene.add.graphics();
        this.draw();
    }

    // Method to decrease health
    decrease(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        this.draw();

        if (this.currentHealth <= 0) {
            this.scene.scene.start('GameOver');
        }
    }

    // Method to increase health
    increase(amount) {
        this.currentHealth += amount;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        this.draw();
    }

    // Draw or update the health bar
    draw() {
        this.bar.clear();
        // Background for health bar (usually red or dark)
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // Health bar foreground (green by default)
        const healthPercentage = this.currentHealth / this.maxHealth;
        this.bar.fillStyle(0x00ff00);
        this.bar.fillRect(this.x, this.y, this.width * healthPercentage, this.height);
    }

    // Update the position of the health bar (e.g., above the player)
    updatePosition(x, y) {
        this.x = x - -4 / 2;  // Center the health bar horizontally
        this.y = y - 20;  // Offset vertically above the player
        this.draw();
    }
}

// 怪物血量
class geeksHealthBar {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;

        // Health bar (current health)
        this.healthBar = this.scene.add.graphics();
        this.updatePosition(x, y);
        this.draw();
    }

    decrease(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) this.currentHealth = 0;
        this.draw();
    }

    draw() {
        this.healthBar.clear();
        const healthPercentage = this.currentHealth / this.maxHealth;
        this.healthBar.fillStyle(0xff0000);  // Red color
        this.healthBar.fillRect(0, 0, this.width * healthPercentage, this.height);
    }

    updatePosition(x, y) {
        this.healthBar.setPosition(x - this.width / 2, y);
    }
}