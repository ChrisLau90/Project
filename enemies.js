var SoldierEnemy = me.ObjectEntity.extend({

    init: function(x , y, settings){
        settings.image = "enemy_soldier";
        settings.spritewidth = 72;

        this.parent(x, y, settings);

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite

        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        //this.walkLeft = true;

        this.setVelocity(3,5);
        this.animationspeed = me.sys.fps / 20;
        this.updateColRect(20, 34, 38, 70);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.isMoving = false;
        this.aimingUp = false;
        this.aimingLeft = true;
        this.aimingDown = false;

        // set animations
        this.addAnimation("stand", [0]);
        this.addAnimation("step", [1]);
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);
        this.addAnimation("aimUp", [12]);
        this.addAnimation("aimDown", [13]);
    },

    // manage the enemy movement
    update: function() {
        // do nothing if not visible

        if (!this.visible){
            console.log('lol');
            return false;
        }

        if (this.alive) {
            if (this.aimingLeft && this.pos.x <= this.startX) {
                this.aimingLeft = false;
            } else if (!this.aimingLeft && this.pos.x >= this.endX) {
                this.aimingLeft = true;
            }
            // make it walk
            this.flipX(this.aimingLeft);
            this.vel.x += (this.aimingLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

        } else {
            this.vel.x = 0;
        }

        // check and update movement
        this.updateMovement();
        //this.playerInSight();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
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
    },

    playerInSight: function(){
        var inSight = false
        var player = me.game.getEntityByName("mainPlayer")[0];

        var angle = this.angleTo(player);
        console.log(angle);
    }
});