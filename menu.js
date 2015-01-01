/* 
*  Development by DropDead Games
*  www.dropdeadgames.org
*  Jacob Colborn
*  email: jcolborn@dropdeadgames.org
*  The right to use this code is subject to the license binding this game.
*  Game art by Sharm, surt, and vk via http://opengameart.org/content/simple-broad-purpose-tileset under the CC0 license.
*  Music by: Bruce Burns & Eliot Corley from ChaosIsHarmony under the CC-By 3.0 license
*/

Game.Menu = function (game) { };

var spaceEvent = 0;

Game.Menu.prototype = {
    
    create: function() {
        
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.soundKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.soundKey.onDown.add(this.pauseMusic, this);
    
        var logo = game.add.sprite(width/2, -150, 'menu');
        logo.anchor.setTo(0.5, 0.5);
        game.add.tween(logo).to({ y: height/2 - 20 }, 1000, Phaser.Easing.Bounce.Out).start(); // Creates bounce in effect of menu

        var label = game.add.text(width/2, height - 60, 'Use the UP arrow to start', { font: '24px Arial', fill: '#ffff' });
        label.anchor.setTo(0.5, 0.5);
        // label.alpha = 0;
        // game.add.tween(label).delay(500).to({ alpha: 1}, 500).start();
        game.add.tween(label).to({y: height - 70}, 500).to({y: height - 50}, 500).loop().start();
        // Play the game music
        gameMusic = this.game.add.audio('music', 1, true, true); // 3rd options set loop
        gameMusic.play();
        playMusic = true;
	},

	update: function() {
        
		if (this.cursor.up.isDown) {
			this.game.state.start('Play');
        }
	},
    
    pauseMusic: function() {
        console.log("Spacebar pressed");
        if (playMusic) {
            gameMusic.pause();
            playMusic = false;
        }
        else {
            gameMusic.restart();
            playMusic = true;
        }
    },
};                                                                            