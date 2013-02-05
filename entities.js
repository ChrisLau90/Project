/*--------------------------------------
	Player Entity
---------------------------------------*/
var PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(3,15);

        this.animationspeed = me.sys.fps / 3;

		// set the display to follow the position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // set animations
        this.addAnimation("stand", [0]); //standing
        this.addAnimation("step", [1]); //first step
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);  //running

        this.isMoving = false;

        /*------
         if(!this.isCurrentAnimation("stand")){
            this.setCurrentAnimation("stand", function(){
                this.setCurrentAnimation("step", function(){
                    this.setCurrentAnimation("run");
                });
            });
         }
         */

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
            this.isMoving = true;

        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
            this.isMoving = true;

        } else {
            this.vel.x = 0;
            //this.setCurrentAnimation("stand");
            if(!this.isCurrentAnimation("stand")){
                this.setCurrentAnimation("stand", function(){
                    if(this.isMoving){
                        this.setCurrentAnimation("step", function(){
                            this.setCurrentAnimation("run");
                        });
                    }
                });
            }
            this.isMoving = false;
            this.setAnimationFrame();
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
        //if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
        //}
        this.parent(this);
        return true;

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        //return false;
    }
});