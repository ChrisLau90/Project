/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

var jsApp	= 
{
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		// init the video
		if (!me.video.init('jsapp', 700, 480, false, 1.0))
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
        me.entityPool.add("pickup_orb", OrbPickup);
        me.entityPool.add("pickup_orb_large", LargeOrbPickup);
        me.entityPool.add("pickup_health", HealthPickup);
        me.entityPool.add("pickup_automatic", AutomaticPickup);
        me.entityPool.add("pickup_laser", LaserPickup);
        me.entityPool.add("map_limit", MapLimit);
        me.entityPool.add("tutorial_point", TutorialPoint);

		// enable keyboard
		this.bindKeys();

      	// start the game 
		me.state.change(me.state.PLAY);
	},

    bindKeys: function(){
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.L, "jump");
        me.input.bindKey(me.input.KEY.X, "jump");
        me.input.bindKey(me.input.KEY.K, "shoot");
        me.input.bindKey(me.input.KEY.C, "shoot");
        me.input.bindKey(me.input.KEY.ESC, "pause", true);
    },

    unbindKeys: function(){
        me.input.unbindKey(me.input.KEY.A, "left");
        me.input.unbindKey(me.input.KEY.LEFT, "left");
        me.input.unbindKey(me.input.KEY.D, "right");
        me.input.unbindKey(me.input.KEY.RIGHT, "right");
        me.input.unbindKey(me.input.KEY.W, "up");
        me.input.unbindKey(me.input.KEY.UP, "up");
        me.input.unbindKey(me.input.KEY.S, "down");
        me.input.unbindKey(me.input.KEY.DOWN, "down");
        me.input.unbindKey(me.input.KEY.L, "jump");
        me.input.unbindKey(me.input.KEY.X, "jump");
        me.input.unbindKey(me.input.KEY.K, "shoot");
        me.input.unbindKey(me.input.KEY.C, "shoot");
        me.input.unbindKey(me.input.KEY.ESC, "pause", true);
    }
}; // jsApp


/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   	onResetEvent: function()
	{	
      	// stuff to reset on state change
      	// load level
      	me.levelDirector.loadLevel("level" + level);
        me.game.addHUD(0, 0, 700, 480);
        me.game.HUD.addItem("score", new ScoreObject(550 ,10));
        me.game.HUD.addItem("health", new HealthObject(140,440));
        me.game.HUD.addItem("ammo", new AmmoObject(550, 440));
        me.game.HUD.addItem("time", new TimerObject(140, 10));
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


/*
window.onReady(function() 
{
	jsApp.onload();
});
*/