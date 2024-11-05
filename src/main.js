import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',  // 必须启用 arcade 物理系统
        arcade: {
            gravity: { y: 300 },  // 设置全局重力
            debug: false          // 关闭调试模式
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ]
};

export default new Phaser.Game(config);
