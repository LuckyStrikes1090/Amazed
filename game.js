/* 
*  Development by DropDead Games
*  www.dropdeadgames.org
*  Jacob Colborn
*  email: jcolborn@dropdeadgames.org
*  The right to use this code is subject to the license binding this game.
*  Game art by Sharm, surt, and vk via http://opengameart.org/content/simple-broad-purpose-tileset under the CC0 license.
*  Music by: Bruce Burns & Eliot Corley from ChaosIsHarmony under the CC-By 3.0 license
*/

var game = new Phaser.Game(width, height, Phaser.Auto, 'gameContainer');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);

game.state.start('Boot');