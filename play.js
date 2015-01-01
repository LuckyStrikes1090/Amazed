/* 
*  Development by DropDead Games
*  www.dropdeadgames.org
*  Jacob Colborn
*  email: jcolborn@dropdeadgames.org
*  The right to use this code is subject to the license binding this game.
*  Game art by Sharm, surt, and vk via http://opengameart.org/content/simple-broad-purpose-tileset under the CC0 license.
*  Music by: Bruce Burns & Eliot Corley from ChaosIsHarmony under the CC-By 3.0 license
*/

var levelSelect = 0;

Game.Play = function (game) { };

Game.Play.prototype = {
    
    create: function () {       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Initialization for the cursor keys used in player movement
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.soundKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.soundKey.onDown.add(this.pauseMusic, this);
        
        this.loadMap();
        
        // Loads the player with the playerStart position from Tiled
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        // this.player.body.gravity.y = 1000;
        this.player.animations.add('run', [1,2,3], 10, true); // Add a running animation
        
        
        this.game.camera.follow(this.player); // Sets the camera to follow the player object
        // Label to give the amount of gems collected per level
        this.labelGem = game.add.text(20, 20, '0', {font: '30px Arial', fill: '#ffff00'});
        this.labelGem.fixedToCamera = true; // Fixes the position of this label in the camera coordinates
    },
    
    update: function() {
        // Collision detection on the player and different objects
        this.game.physics.arcade.collide(this.player, this.blockedlayer); // Player and the blockedLayer of the tilemap
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this); // Player and the gems
        this.game.physics.arcade.overlap(this.player, this.ladder, this.nextLevel, null, this); // Player and the ladder
        this.game.physics.arcade.overlap(this.player, this.water, this.restartGame, null, this); // Player and the water
        
        this.player.body.velocity.y = 0; // Set players velocity to 0 after every update
        this.player.body.velocity.x = 0;
        // Cursor keys to control the player
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 75;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 75;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 75;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 75;
        }
        
        if (this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
            this.player.animations.play('run');
        }
        else {
            this.player.animations.stop('run');
        }
    },
        
    loadMap: function() {       
        // Loads the tilemap from Tiled
        this.map = game.add.tilemap(level[levelSelect]); // Declaration given to tilemap asset in load.js
        this.map.addTilesetImage('tileset', 'tileset'); // f1 is tileset name in Tiled, f2 is the name of the tileset in load.js
        this.backgroundlayer = this.map.createLayer('backgroundLayer'); // Creates the 3 layers defined by the tilemap
        this.blockedlayer = this.map.createLayer('blockedLayer'); // Creates the 3 layers defined by the tilemap
        this.map.setCollisionBetween(1, 4000, true, 'blockedLayer'); // Creates the 3 layers defined by the tilemap
        this.backgroundlayer.resizeWorld(); // Resizes the world based on the backgroundLayer property
        
        this.createItems();  // Call to create items
        this.createLadder(); // Call to create laddders
        this.createWater(); // Call to create the water
    },
    
    createItems: function() {
        // Creates a group and filles it based on the 'item' type in the Tiled tilemap
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        result = this.findObjectsByType('item', this.map, 'objectsLayer'); // item defined in tilemap, objectsLayer defined in tilemap
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },
    
    createLadder: function() {
        // Creates a group and fills it based on the 'ladder' type in the Tiled tiledmap
        this.ladder = this.game.add.group();
        this.ladder.enableBody = true;
        result = this.findObjectsByType('ladder', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.ladder);
        }, this);
    },
    
    createWater: function() {
        // Creates a group for the water tiles, based on the 'water' type in the Tiled tilemap
        this.water = this.game.add.group();
        this.water.enableBody = true;
        result = this.findObjectsByType('water', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.water);
        }, this);
    },
    
    findObjectsByType: function(type, map, layer) {    
        // Loads the objects from the objectsLayer of the Tiled tilemap into the results array
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    
    createFromTiledObject: function(element, group) {
        // Loads the sprite that is defined by the sprite property of the object in Tiled
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },
    
    nextLevel: function() {
        // Loads the next level if the player finds the ladder and has all 6 gems
        if (gems == 6) {
            console.log('Next Level!');
            gems = 0;
            levelSelect += 1;
            game.state.start('Play');
        }
        else {
            console.log('Not enough gems');
            // this.printLabel = game.add.text(width/2, height/2, 'Please find all 6 gems ... ', {font: '20px Arial', fill: '#ffff00'});
            // this.printLabel.fixedToCamera = true;
            // this.timer = game.time.events.add(2000, this.printLabel.destroy, this);
        }
    },
    
    restartGame: function() {
        game.state.start('Play');  
    },
    
    collect: function(player, collectable) {
        // Collects the gems for the player
        gems += 1;
        this.labelGem.text = gems;
        console.log('collected');
        collectable.destroy();
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