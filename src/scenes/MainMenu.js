import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 300, 'logo');

        const startText  = this.add.text(512, 460, '点击开始', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        startText.setInteractive(); // 将文本设置为可交互
        // 鼠标悬停时变大
        startText.on('pointerover', () => {
            startText.setFontSize(48); // 增加字体大小
            this.input.setDefaultCursor('pointer'); // 设置鼠标为点击样式
        });

        // 鼠标移出时恢复原大小
        startText.on('pointerout', () => {
            startText.setFontSize(38); // 恢复原大小
            this.input.setDefaultCursor(''); // 恢复默认鼠标样式
        });

        // 点击事件切换场景
        startText.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
