/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
	name: "testTile",
	type: "image",
	src: "data/tilesets/testTile.png"
}, {
	name: "test1",
	type: "tmx",
	src: "data/maps/test1.tmx"
}, {
    name: "area01_tiles",
    type: "image",
    src: "data/tilesets/area01_tiles.png"
},{
    name: "test2",
    type: "tmx",
    src: "data/maps/test2.tmx"
}, {
    name: "test3",
    type: "tmx",
    src: "data/maps/test3.tmx"
}, {
	name: "player_right",
	type: "image",
	src: "data/sprites/player_right.png"
}, {
    name: "player_up",
    type: "image",
    src: "data/sprites/player_up.png"
}, {
    name: "player_down",
    type: "image",
    src: "data/sprites/player_down.png"
}, {
	name: "player_bullet",
	type: "image",
	src: "data/sprites/player_bullet.png"
}, {
    name: "enemy_soldier",
    type: "image",
    src: "data/sprites/enemy_soldier.png"
},{
    name: "enemy_bullet",
    type: "image",
    src: "data/sprites/enemy_bullet.png"
}, {
    name: "enemy_roller",
    type: "image",
    src: "data/sprites/enemy_roller.png"
}, {
    name: "enemy_cannon",
    type: "image",
    src: "data/sprites/enemy_cannon.png"
}, {
    name: "enemy_cannon_plasma",
    type: "image",
    src: "data/sprites/enemy_cannon_plasma.png"
}, {
    name: "enemy_cannon_rocket",
    type: "image",
    src: "data/sprites/enemy_cannon_rocket.png"
}, {
    name: "enemy_chopper",
    type: "image",
    src: "data/sprites/enemy_chopper.png"
}, {
    name: "enemy_wasp",
    type: "image",
    src: "data/sprites/enemy_wasp.png"
}, {
    name: "enemy_wasp_bomb",
    type: "image",
    src: "data/sprites/enemy_wasp_bomb.png"
}, {
    name: "explosion",
    type: "image",
    src: "data/sprites/explosion.png"
}, {
    name: "atascii_font",
    type: "image",
    src: "data/font/atascii_16px.png"
}];


var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 600, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         	return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

		// add player to entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
        me.entityPool.add("enemy_soldier", SoldierEnemy);
        me.entityPool.add("enemy_roller", RollerEnemy);
        me.entityPool.add("enemy_cannon", CannonEnemy);
        me.entityPool.add("enemy_chopper", ChopperEnemy);
        me.entityPool.add("enemy_wasp", WaspEnemy);

		// enable keyboard
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.S, "down");
		me.input.bindKey(me.input.KEY.L, "jump");
        me.input.bindKey(me.input.KEY.K, "shoot", true);
      
      	// start the game 
		me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   	onResetEvent: function()
	{	
      	// stuff to reset on state change
      	// load level
      	me.levelDirector.loadLevel("test2");
        me.game.addHUD(0, 0, 600, 30);
        me.game.HUD.addItem("score", new ScoreObject(300,10));
        me.game.sort();
	},
	
	/* ---
		 action to perform when game is finished (state change)
		---	*/
	onDestroyEvent: function()
	{
        me.game.disableHUD();
    }
});

//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
