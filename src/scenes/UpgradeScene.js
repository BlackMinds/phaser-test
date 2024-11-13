import { Scene } from 'phaser';

export class UpgradeScene extends Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
        // this.player = this.scene.get('Game').player;
    }

    create() {
        this.player = this.scene.get('Game').player;
        // 添加背景和设置透明度
        this.add.rectangle(
            this.scale.width / 2,       // X 坐标设为屏幕中心
            this.scale.height / 2,      // Y 坐标设为屏幕中心
            this.scale.width,           // 宽度设为屏幕宽度
            this.scale.height,          // 高度设为屏幕高度
            0x000000,                   // 背景颜色
            0.7                          // 透明度
        );

        // 显示三个选项
        const option1 = this.add.text(300, 200, '选项 1：增加攻击力', { fontSize: '20px', fill: '#ffffff' }).setInteractive();
        const option2 = this.add.text(300, 300, '选项 2：增加生命值', { fontSize: '20px', fill: '#ffffff' }).setInteractive();
        const option3 = this.add.text(300, 400, '选项 3：增加速度', { fontSize: '20px', fill: '#ffffff' }).setInteractive();

        // 添加点击事件处理
        option1.on('pointerdown', () => this.chooseUpgrade('attack'));
        option2.on('pointerdown', () => this.chooseUpgrade('health'));
        option3.on('pointerdown', () => this.chooseUpgrade('speed'));
    }

    chooseUpgrade(option) {
        // 这里可以添加选择升级后的效果处理逻辑，比如增加攻击力、生命值或速度
        if (option === 'attack') {
            // 增加攻击力
            this.scene.get('Game').player.attackPower += 10;
        } else if (option === 'health') {
            // 增加生命值
            this.scene.get('Game').player.maxHealth += 20;
        } else if (option === 'speed') {
            // 增加速度
            this.scene.get('Game').player.speed += 300;
        }

        // 选择完毕后恢复游戏
        this.scene.resume('Game');
        this.scene.stop();
    }
}
