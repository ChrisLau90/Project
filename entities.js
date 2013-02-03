/*--------------------------------------
	Player Entity
---------------------------------------*/
var PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(3,15);

		// set the display to follow the position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // set animations
        this.addAnimation("standStep", [0,1]);              //standing + first step
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);  //running

        this.setCurrentAnimation("standStep", function(){
            this.setCurrentAnimation("run");
        });
	},

	/*----------------------------------
		Constructor
	-----------------------------------*/
	update: function() {
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;
            // RESET THE ANIMATION(?)
            if(!this.isCurrentAnimation("standStep")){
                this.setCurrentAnimation("standStep", function(){
                    this.setCurrentAnimation("run");
                });
            }
        }
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
        }

        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
});