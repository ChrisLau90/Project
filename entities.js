/*--------------------------------------
	Player Entity
---------------------------------------*/
var PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(3,20);

        this.animationspeed = me.sys.fps / 20;

		// set the display to follow the position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // set animations
        this.addAnimation("stand", [0]);
        this.addAnimation("step", [1]);
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);
        this.addAnimation("jump", [12,13]);
        this.addAnimation("jump2", [14]);
        this.addAnimation("fall", [15]);
        this.addAnimation("fall2", [16]);
        this.addAnimation("land", [17]);

        //variables
        this.isMoving = false;

	},

	/*----------------------------------
		Constructor
	-----------------------------------*/
	update: function() {

        this.stateMachine();

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
            this.isMoving = false;
        }
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
                this.hasLanded = false;
            }
        }

        // check & update player movement
        this.updateMovement();

        //call the update
        this.parent(this);
        return true;

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        //return false;
    },

    stateMachine: function(){
        //var velY = this.vel.y;
        switch (true) {
            case (this.vel.y < 0):
                //jump
                if (this.isCurrentAnimation("stand") || this.isCurrentAnimation("step") ||
                    this.isCurrentAnimation("run")){
                    this.setCurrentAnimation("jump", function(){
                        this.setCurrentAnimation("jump2");
                        //this.setAnimationFrame();
                    });
                }
                break;
            case (this.vel.y > 0):
                //fall
                if (this.isCurrentAnimation("jump") || this.isCurrentAnimation("jump2") ||
                    this.isCurrentAnimation("step") || this.isCurrentAnimation("run")){
                    this.setCurrentAnimation("fall", function(){
                        this.setCurrentAnimation("fall2");
                    });
                }
                break;
            case (this.vel.y == 0):
                //stand
                //this.checkAnimation();
                if (this.isCurrentAnimation("fall") || this.isCurrentAnimation("fall2")){
                    this.setCurrentAnimation("land", this.checkAnimation());
                }
                else {
                    this.checkAnimation();
                }
                break;
        }
    },

    checkAnimation: function(){
        if(!this.isMoving){
            this.setCurrentAnimation("stand", function(){
                if(this.isMoving){
                    this.setCurrentAnimation("step", function(){
                        this.setCurrentAnimation("run");
                        this.setAnimationFrame();
                    });
                }
            });
        }
        else if(this.isCurrentAnimation("land")){
            this.setCurrentAnimation("step", function(){
                this.setCurrentAnimation("run");
                this.setAnimationFrame();
            });
        }
    }
});